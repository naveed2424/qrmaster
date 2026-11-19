import { SupportedLanguage } from '../types/qr';
import { TRANSLATIONS } from '../data/translations';

const GOOGLE_LANG_MAP: Record<SupportedLanguage, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  it: 'it',
  ja: 'ja',
  ar: 'ar',
  zh: 'zh-CN',
  hi: 'hi',
  ru: 'ru',
  ko: 'ko',
  tr: 'tr',
  id: 'id',
  nl: 'nl',
  pl: 'pl',
};

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'SVG',
  'CANVAS',
  'CODE',
  'PRE',
  'KBD',
  'SAMP',
  'TEXTAREA',
  'IFRAME',
  'OBJECT',
  'VIDEO',
  'AUDIO',
]);

const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'alt', 'aria-label'] as const;
type TranslatableAttr = (typeof TRANSLATABLE_ATTRS)[number];

const CACHE_PREFIX = 'qr_tr_v1_';
const MAX_CACHE_ENTRIES_PER_LANG = 1400;

// Maps tracking original English source text and last translated text written by us
const originalTextMap = new WeakMap<Text, string>();
const appliedTextMap = new WeakMap<Text, string>();
const nodeLangMap = new WeakMap<Text, SupportedLanguage>();

const originalAttrMap = new WeakMap<Element, Partial<Record<TranslatableAttr, string>>>();
const appliedAttrMap = new WeakMap<Element, Partial<Record<TranslatableAttr, string>>>();
const attrLangMap = new WeakMap<Element, Partial<Record<TranslatableAttr, SupportedLanguage>>>();

const memoryCache = new Map<SupportedLanguage, Map<string, string>>();
const nativeDictCache = new Map<SupportedLanguage, Set<string>>();
const inflightTranslations = new Map<string, Promise<string>>();
const persistTimers = new Map<SupportedLanguage, number>();

function getNativeDictSet(lang: SupportedLanguage): Set<string> {
  let set = nativeDictCache.get(lang);
  if (set) return set;

  set = new Set<string>();
  const dict = TRANSLATIONS[lang];
  if (dict && lang !== 'en') {
    const collectValues = (obj: Record<string, unknown>) => {
      for (const val of Object.values(obj)) {
        if (typeof val === 'string') {
          set!.add(val.trim().replace(/\s+/g, ' '));
        } else if (val && typeof val === 'object') {
          collectValues(val as Record<string, unknown>);
        }
      }
    };
    collectValues(dict as unknown as Record<string, unknown>);
  }
  nativeDictCache.set(lang, set);
  return set;
}

function getLangCache(lang: SupportedLanguage): Map<string, string> {
  let map = memoryCache.get(lang);
  if (map) return map;

  map = new Map<string, string>();
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${lang}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>;
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof k === 'string' && typeof v === 'string') {
          map.set(k, v);
        }
      }
    }
  } catch {
    // Ignore storage read errors
  }
  memoryCache.set(lang, map);
  return map;
}

function schedulePersistCache(lang: SupportedLanguage) {
  if (typeof window === 'undefined' || lang === 'en') return;
  const existing = persistTimers.get(lang);
  if (existing) {
    window.clearTimeout(existing);
  }
  const timer = window.setTimeout(() => {
    persistTimers.delete(lang);
    const map = memoryCache.get(lang);
    if (!map) return;
    try {
      // Keep the most recent MAX_CACHE_ENTRIES_PER_LANG entries to stay well within storage quota
      const entries = Array.from(map.entries());
      const trimmed =
        entries.length > MAX_CACHE_ENTRIES_PER_LANG
          ? entries.slice(entries.length - MAX_CACHE_ENTRIES_PER_LANG)
          : entries;
      if (trimmed.length !== entries.length) {
        map.clear();
        for (const [k, v] of trimmed) map.set(k, v);
      }
      localStorage.setItem(`${CACHE_PREFIX}${lang}`, JSON.stringify(Object.fromEntries(trimmed)));
    } catch {
      // Storage quota full: trim further cleanly
      try {
        const entries = Array.from(map.entries()).slice(-500);
        localStorage.setItem(`${CACHE_PREFIX}${lang}`, JSON.stringify(Object.fromEntries(entries)));
      } catch {
        // Ignore
      }
    }
  }, 500);
  persistTimers.set(lang, timer);
}

function shouldSkipElement(el: Element | null): boolean {
  let cur: Element | null = el;
  while (cur) {
    if (SKIP_TAGS.has(cur.tagName)) return true;
    const noTr = cur.getAttribute('data-no-translate');
    if (noTr === 'true' || cur.getAttribute('translate') === 'no' || cur.classList.contains('notranslate')) {
      return true;
    }
    cur = cur.parentElement;
  }
  return false;
}

function isNonTranslatableText(raw: string): boolean {
  const s = raw.replace(/\s+/g, ' ').trim();
  if (!s || s.length < 2) return true;

  // Must contain at least one letter (Latin or Unicode letter)
  if (!/\p{L}/u.test(s)) return true;

  // Brand names, emails, URLs, hex codes, QR technical prefixes
  if (/^(2qrcode\.com|2qrcode|https?:\/\/\S+|mailto:\S+|tel:\S+|sms:\S+|WIFI:\S+|BEGIN:VCARD|BEGIN:VEVENT|#[0-9a-fA-F]{3,8})$/i.test(s)) {
    return true;
  }
  if (/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(s)) return true;

  // Short code badges like "300 DPI", "1024px", "SVG", "PNG", "JPG", "CSV", "ZIP", "PDF", "UTC+0"
  if (/^(\d+(\.\d+)?\s*(px|mm|cm|in|dpi|kb|mb|ms|s|%|x|×)|svg|png|jpg|jpeg|webp|csv|zip|pdf|utf-8|iso\/iec\s*\d+|v\d+(\.\d+)?)$/i.test(s)) {
    return true;
  }

  // Country ISO codes or language codes (e.g., "US", "FR", "EN")
  if (/^[A-Z]{2,3}$/.test(s) && s !== 'FAQ' && s !== 'URL') {
    return true;
  }

  return false;
}

async function fetchGoogleGtx(q: string, tl: string): Promise<string | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
    tl
  )}&dt=t&q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
  return (data[0] as Array<[string, ...unknown[]]>)
    .map((seg) => (seg && typeof seg[0] === 'string' ? seg[0] : ''))
    .join('');
}

async function fetchClients5(q: string, tl: string): Promise<string | null> {
  const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=${encodeURIComponent(
    tl
  )}&q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (Array.isArray(data)) {
    if (typeof data[0] === 'string') return data[0];
    if (Array.isArray(data[0]) && typeof data[0][0] === 'string') return data[0][0];
  }
  return null;
}

async function fetchMyMemory(q: string, tl: string): Promise<string | null> {
  if (q.length > 450) return null;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(
    `en|${tl}`
  )}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (typeof translated === 'string' && translated.trim() && !translated.includes('MYMEMORY WARNING')) {
    return translated;
  }
  return null;
}

async function rawTranslateText(q: string, targetLang: SupportedLanguage): Promise<string | null> {
  const tl = GOOGLE_LANG_MAP[targetLang] || targetLang;
  try {
    const gtx = await fetchGoogleGtx(q, tl);
    if (gtx !== null && gtx.trim()) return gtx;
  } catch {
    // Fallback
  }
  try {
    const c5 = await fetchClients5(q, tl);
    if (c5 !== null && c5.trim()) return c5;
  } catch {
    // Fallback
  }
  if (!q.includes('\n') && q.length <= 450) {
    try {
      const mm = await fetchMyMemory(q, tl);
      if (mm !== null && mm.trim()) return mm;
    } catch {
      // Ignore
    }
  }
  return null;
}

async function translateBatchExact(items: string[], targetLang: SupportedLanguage): Promise<string[]> {
  if (items.length === 0) return [];
  const cache = getLangCache(targetLang);

  if (items.length === 1) {
    const single = items[0];
    const cached = cache.get(single);
    if (cached !== undefined) return [cached];

    const inflightKey = `${targetLang}::${single}`;
    const existing = inflightTranslations.get(inflightKey);
    if (existing) {
      return [await existing];
    }

    const promise = (async () => {
      const out = await rawTranslateText(single, targetLang);
      const finalOut = out && out.trim() ? out.trim() : single;
      if (out && out.trim()) {
        cache.set(single, finalOut);
        schedulePersistCache(targetLang);
      }
      return finalOut;
    })().finally(() => {
      inflightTranslations.delete(inflightKey);
    });

    inflightTranslations.set(inflightKey, promise);
    return [await promise];
  }

  // Batch multiple single-line strings joined with newline
  const joined = items.join('\n');
  const raw = await rawTranslateText(joined, targetLang);

  if (raw !== null) {
    const lines = raw.split('\n').map((l) => l.trim());
    if (lines.length === items.length) {
      const results = lines.map((line, i) => {
        const val = line || items[i];
        cache.set(items[i], val);
        return val;
      });
      schedulePersistCache(targetLang);
      return results;
    }
  }

  // Bisect cleanly so line mismatches never misalign paragraphs or labels
  const mid = Math.ceil(items.length / 2);
  const [left, right] = await Promise.all([
    translateBatchExact(items.slice(0, mid), targetLang),
    translateBatchExact(items.slice(mid), targetLang),
  ]);
  return [...left, ...right];
}

export async function translateStrings(
  uniqueStrings: string[],
  targetLang: SupportedLanguage
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (targetLang === 'en' || uniqueStrings.length === 0) {
    for (const s of uniqueStrings) result.set(s, s);
    return result;
  }

  const cache = getLangCache(targetLang);
  const missing: string[] = [];

  for (const s of uniqueStrings) {
    const hit = cache.get(s);
    if (hit !== undefined) {
      result.set(s, hit);
    } else {
      missing.push(s);
    }
  }

  if (missing.length === 0) return result;

  // Chunk into batches of <= 12 items and <= 1150 chars
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentChars = 0;

  for (const s of missing) {
    if (currentChunk.length >= 12 || (currentChunk.length > 0 && currentChars + s.length + 1 > 1150)) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentChars = 0;
    }
    currentChunk.push(s);
    currentChars += s.length + 1;
  }
  if (currentChunk.length > 0) chunks.push(currentChunk);

  // Process up to 3 concurrent requests at a time to balance speed and rate limits
  const concurrency = 3;
  for (let i = 0; i < chunks.length; i += concurrency) {
    const slice = chunks.slice(i, i + concurrency);
    const translatedChunks = await Promise.all(
      slice.map((chunk) => translateBatchExact(chunk, targetLang))
    );
    slice.forEach((chunk, idx) => {
      chunk.forEach((orig, itemIdx) => {
        result.set(orig, translatedChunks[idx][itemIdx] || orig);
      });
    });
  }

  return result;
}

interface TextTarget {
  node: Text;
  originalRaw: string;
  core: string;
  leading: string;
  trailing: string;
}

interface AttrTarget {
  el: Element;
  attr: TranslatableAttr;
  core: string;
}

function collectDomTargets(root: Element, targetLang: SupportedLanguage) {
  const textTargets: TextTarget[] = [];
  const attrTargets: AttrTarget[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current: Node | null = walker.currentNode;

  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      const textNode = current as Text;
      const parentEl = textNode.parentElement;
      if (parentEl && !shouldSkipElement(parentEl)) {
        const currentVal = textNode.nodeValue || '';
        const appliedVal = appliedTextMap.get(textNode);

        // If React changed the underlying text node since our last write, refresh original English source
        if (!originalTextMap.has(textNode) || (appliedVal !== undefined && currentVal !== appliedVal)) {
          originalTextMap.set(textNode, currentVal);
          appliedTextMap.delete(textNode);
          nodeLangMap.set(textNode, 'en');
        }

        const originalRaw = originalTextMap.get(textNode) ?? currentVal;
        const currentNodeLang = nodeLangMap.get(textNode) || 'en';

        if (targetLang === 'en') {
          if (currentVal !== originalRaw) {
            textNode.nodeValue = originalRaw;
          }
          appliedTextMap.delete(textNode);
          nodeLangMap.set(textNode, 'en');
        } else if (currentNodeLang !== targetLang && !isNonTranslatableText(originalRaw)) {
          const leadingMatch = originalRaw.match(/^\s*/);
          const trailingMatch = originalRaw.match(/\s*$/);
          const leading = leadingMatch ? leadingMatch[0] : '';
          const trailing = trailingMatch ? trailingMatch[0] : '';
          const core = originalRaw.trim().replace(/\s+/g, ' ');
          if (core && !getNativeDictSet(targetLang).has(core)) {
            textTargets.push({ node: textNode, originalRaw, core, leading, trailing });
          } else if (core) {
            nodeLangMap.set(textNode, targetLang);
          }
        }
      }
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      const el = current as Element;
      if (!shouldSkipElement(el)) {
        for (const attr of TRANSLATABLE_ATTRS) {
          const curAttrVal = el.getAttribute(attr);
          if (curAttrVal === null) continue;

          // Skip placeholder examples that are URLs or emails inside input fields
          if (attr === 'placeholder' && /^(https?:\/\/|www\.|[\w.+-]+@)/i.test(curAttrVal.trim())) {
            continue;
          }

          let origMap = originalAttrMap.get(el);
          let appMap = appliedAttrMap.get(el);
          let langMap = attrLangMap.get(el);
          if (!origMap) {
            origMap = {};
            originalAttrMap.set(el, origMap);
          }
          if (!appMap) {
            appMap = {};
            appliedAttrMap.set(el, appMap);
          }
          if (!langMap) {
            langMap = {};
            attrLangMap.set(el, langMap);
          }

          if (origMap[attr] === undefined || (appMap[attr] !== undefined && curAttrVal !== appMap[attr])) {
            origMap[attr] = curAttrVal;
            delete appMap[attr];
            langMap[attr] = 'en';
          }

          const origAttrVal = origMap[attr]!;
          if (targetLang === 'en') {
            if (curAttrVal !== origAttrVal) {
              el.setAttribute(attr, origAttrVal);
            }
            delete appMap[attr];
            langMap[attr] = 'en';
          } else if (langMap[attr] !== targetLang && !isNonTranslatableText(origAttrVal)) {
            const core = origAttrVal.trim().replace(/\s+/g, ' ');
            if (core) {
              attrTargets.push({ el, attr, core });
            }
          }
        }
      }
    }
    current = walker.nextNode();
  }

  return { textTargets, attrTargets };
}

export class GlobalDomTranslator {
  private root: Element;
  private currentLang: SupportedLanguage = 'en';
  private observer: MutationObserver | null = null;
  private debounceTimer: number | null = null;
  private isApplying = false;
  private generationToken = 0;
  private onBusyChange?: (busy: boolean) => void;

  constructor(root: Element, onBusyChange?: (busy: boolean) => void) {
    this.root = root;
    this.onBusyChange = onBusyChange;
  }

  start(initialLang: SupportedLanguage) {
    this.currentLang = initialLang;
    this.observer = new MutationObserver((mutations) => {
      if (this.isApplying) return;
      if (this.currentLang === 'en') return;

      let hasRelevantChange = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          hasRelevantChange = true;
          break;
        }
        if (m.type === 'characterData') {
          const tNode = m.target as Text;
          if (tNode.nodeValue !== appliedTextMap.get(tNode)) {
            hasRelevantChange = true;
            break;
          }
        }
      }

      if (hasRelevantChange) {
        this.scheduleSweep(70);
      }
    });

    this.observer.observe(this.root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    if (initialLang !== 'en') {
      this.scheduleSweep(40);
    }
  }

  setLanguage(lang: SupportedLanguage) {
    this.currentLang = lang;
    this.generationToken += 1;
    if (lang === 'en') {
      this.restoreEnglish();
      this.onBusyChange?.(false);
    } else {
      this.scheduleSweep(20);
    }
  }

  triggerResync() {
    if (this.currentLang !== 'en') {
      this.scheduleSweep(60);
    }
  }

  private restoreEnglish() {
    this.isApplying = true;
    try {
      collectDomTargets(this.root, 'en');
    } finally {
      this.isApplying = false;
    }
  }

  private scheduleSweep(delayMs: number) {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => {
      this.debounceTimer = null;
      void this.runSweep();
    }, delayMs);
  }

  private async runSweep() {
    const lang = this.currentLang;
    if (lang === 'en') return;
    const token = this.generationToken;

    let textTargets: TextTarget[] = [];
    let attrTargets: AttrTarget[] = [];

    this.isApplying = true;
    try {
      const collected = collectDomTargets(this.root, lang);
      textTargets = collected.textTargets;
      attrTargets = collected.attrTargets;
    } finally {
      this.isApplying = false;
    }

    if (textTargets.length === 0 && attrTargets.length === 0) {
      this.onBusyChange?.(false);
      return;
    }

    const uniqueCores = Array.from(
      new Set([
        ...textTargets.map((t) => t.core),
        ...attrTargets.map((a) => a.core),
      ])
    );

    const cache = getLangCache(lang);
    const hasUncached = uniqueCores.some((s) => !cache.has(s));
    if (hasUncached) {
      this.onBusyChange?.(true);
    }

    try {
      const translatedMap = await translateStrings(uniqueCores, lang);

      // Abort applying stale translations if user switched language mid-flight
      if (token !== this.generationToken || this.currentLang !== lang) return;

      this.isApplying = true;
      try {
        for (const t of textTargets) {
          if (!t.node.isConnected) continue;
          const tr = translatedMap.get(t.core);
          if (!tr) continue;
          const finalText = `${t.leading}${tr}${t.trailing}`;
          if (t.node.nodeValue !== finalText) {
            t.node.nodeValue = finalText;
          }
          appliedTextMap.set(t.node, finalText);
          nodeLangMap.set(t.node, lang);
        }

        for (const a of attrTargets) {
          if (!a.el.isConnected) continue;
          const tr = translatedMap.get(a.core);
          if (!tr) continue;
          a.el.setAttribute(a.attr, tr);
          const appMap = appliedAttrMap.get(a.el) || {};
          appMap[a.attr] = tr;
          appliedAttrMap.set(a.el, appMap);
          const lMap = attrLangMap.get(a.el) || {};
          lMap[a.attr] = lang;
          attrLangMap.set(a.el, lMap);
        }
      } finally {
        this.isApplying = false;
      }
    } finally {
      if (token === this.generationToken) {
        this.onBusyChange?.(false);
      }
    }
  }

  destroy() {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.observer?.disconnect();
    this.observer = null;
  }
}

// Standalone helper for translating document.title & meta description
const originalMetaTitleMap = new Map<string, string>();

export async function translateDocumentMeta(
  englishTitle: string,
  englishDescription: string,
  targetLang: SupportedLanguage
) {
  if (targetLang === 'en') {
    document.title = englishTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', englishDescription);
    return;
  }

  const cache = getLangCache(targetLang);
  if (cache.has(englishTitle)) {
    document.title = cache.get(englishTitle)!;
  }
  if (cache.has(englishDescription)) {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', cache.get(englishDescription)!);
  }

  originalMetaTitleMap.set('title', englishTitle);
  originalMetaTitleMap.set('description', englishDescription);

  const map = await translateStrings([englishTitle, englishDescription], targetLang);
  if (document.documentElement.lang !== targetLang) return;

  const trTitle = map.get(englishTitle);
  const trDesc = map.get(englishDescription);
  if (trTitle) document.title = trTitle;
  if (trDesc) {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', trDesc);
  }
}
