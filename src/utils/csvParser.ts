export interface ParsedCsvData {
  headers: string[];
  rows: Record<string, string>[];
  delimiter: string;
}

export type BatchPayloadMode = 'direct' | 'url-template' | 'wifi' | 'vcard';

export interface BatchColumnMapping {
  mode: BatchPayloadMode;
  labelColumn: string;
  contentColumn: string;
  urlTemplate: string;
  ctaColumn: string;
  wifiSsidColumn: string;
  wifiPasswordColumn: string;
  wifiEncryptionColumn: string;
  vcardFirstNameColumn: string;
  vcardLastNameColumn: string;
  vcardPhoneColumn: string;
  vcardEmailColumn: string;
  vcardCompanyColumn: string;
  vcardTitleColumn: string;
  vcardUrlColumn: string;
}

/**
 * Auto-detects the CSV delimiter (comma, semicolon, or tab) from the first line.
 */
function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim().length > 0) || '';
  const counts = {
    ',': (firstLine.match(/,/g) || []).length,
    ';': (firstLine.match(/;/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
  };
  if (counts['\t'] > counts[','] && counts['\t'] > counts[';']) return '\t';
  if (counts[';'] > counts[','] && counts[';'] > counts['\t']) return ';';
  return ',';
}

/**
 * RFC-4180 compliant CSV parser supporting UTF-8 BOM, quoted commas,
 * escaped quotes (""), and multiline values inside quotes.
 */
export function parseCsv(rawText: string): ParsedCsvData {
  const cleaned = rawText.replace(/^\uFEFF/, '').trim();
  if (!cleaned) {
    return { headers: [], rows: [], delimiter: ',' };
  }

  const delimiter = detectDelimiter(cleaned);
  const matrix: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const nextChar = cleaned[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell.length > 0)) {
          matrix.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell.length > 0)) {
          matrix.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      matrix.push(currentRow);
    }
  }

  if (matrix.length === 0) {
    return { headers: [], rows: [], delimiter };
  }

  // Deduplicate or fill empty header names
  const rawHeaders = matrix[0];
  const seen = new Map<string, number>();
  const headers = rawHeaders.map((h, idx) => {
    const base = h.trim() || `column_${idx + 1}`;
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });

  // If the uploaded file looks like a single-column list with a URL/value on row 1,
  // still treat row 0 as headers if non-URL, or auto-wrap if only 1 column & looks like URL
  if (headers.length === 1 && /^https?:\/\//i.test(headers[0])) {
    const allUrls = matrix.map((r) => ({ url: r[0] || '' }));
    return { headers: ['url'], rows: allUrls, delimiter };
  }

  const rows: Record<string, string>[] = [];
  for (let r = 1; r < matrix.length; r++) {
    const rowArr = matrix[r];
    if (!rowArr.some((c) => c.trim().length > 0)) continue;
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = rowArr[idx] ?? '';
    });
    rows.push(obj);
  }

  return { headers, rows, delimiter };
}

/**
 * Infers sensible initial column mapping from CSV headers.
 */
export function inferColumnMapping(headers: string[]): BatchColumnMapping {
  const findCol = (patterns: RegExp[]): string => {
    for (const p of patterns) {
      const hit = headers.find((h) => p.test(h.toLowerCase()));
      if (hit) return hit;
    }
    return '';
  };

  const hasWifi = headers.some((h) => /ssid|wifi/i.test(h)) && headers.some((h) => /pass/i.test(h));
  const hasVcard =
    headers.some((h) => /first.?name|fname/i.test(h)) &&
    headers.some((h) => /email|phone|tel/i.test(h));

  let mode: BatchPayloadMode = 'direct';
  if (hasWifi) mode = 'wifi';
  else if (hasVcard) mode = 'vcard';

  const labelColumn =
    findCol([/^(label|name|title|filename|id|table|room|sku)$/i, /label|name|title|sku|id/i]) ||
    headers[0] ||
    '';

  const contentColumn =
    findCol([/^(url|link|payload|data|qr|website|text|content)$/i, /url|link|web|text|qr/i]) ||
    headers[1] ||
    headers[0] ||
    '';

  return {
    mode,
    labelColumn,
    contentColumn,
    urlTemplate: contentColumn ? `{{${contentColumn}}}` : 'https://2qrcode.com/',
    ctaColumn: findCol([/^(cta|frame|banner|caption|cta_text)$/i, /cta|frame|caption/i]),
    wifiSsidColumn: findCol([/ssid|network|wifi/i]) || headers[0] || '',
    wifiPasswordColumn: findCol([/pass|pwd|key/i]) || headers[1] || '',
    wifiEncryptionColumn: findCol([/enc|security|auth|type/i]),
    vcardFirstNameColumn: findCol([/first|fname|given/i]) || headers[0] || '',
    vcardLastNameColumn: findCol([/last|lname|surname/i]),
    vcardPhoneColumn: findCol([/phone|tel|mobile|cell/i]),
    vcardEmailColumn: findCol([/email|mail/i]),
    vcardCompanyColumn: findCol([/company|org|business/i]),
    vcardTitleColumn: findCol([/title|role|job/i]),
    vcardUrlColumn: findCol([/url|web|site/i]),
  };
}

/**
 * Generates the final QR payload string for a single row using the active mapping.
 */
export function buildRowPayload(row: Record<string, string>, mapping: BatchColumnMapping): string {
  if (mapping.mode === 'wifi') {
    const ssid = (row[mapping.wifiSsidColumn] || '').replace(/([\\;,:"])/g, '\\$1');
    const pass = (row[mapping.wifiPasswordColumn] || '').replace(/([\\;,:"])/g, '\\$1');
    const rawEnc = (row[mapping.wifiEncryptionColumn] || 'WPA').toUpperCase();
    const enc = rawEnc.includes('WEP') ? 'WEP' : rawEnc.includes('NO') || rawEnc === 'OPEN' ? 'nopass' : 'WPA';
    if (!ssid) return '';
    return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
  }

  if (mapping.mode === 'vcard') {
    const fn = row[mapping.vcardFirstNameColumn] || '';
    const ln = row[mapping.vcardLastNameColumn] || '';
    const phone = row[mapping.vcardPhoneColumn] || '';
    const email = row[mapping.vcardEmailColumn] || '';
    const company = row[mapping.vcardCompanyColumn] || '';
    const title = row[mapping.vcardTitleColumn] || '';
    const url = row[mapping.vcardUrlColumn] || '';
    const fullName = `${fn} ${ln}`.trim();
    if (!fullName && !phone && !email) return '';
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${ln};${fn};;;`,
      `FN:${fullName}`,
      company ? `ORG:${company}` : '',
      title ? `TITLE:${title}` : '',
      phone ? `TEL;TYPE=WORK,VOICE:${phone}` : '',
      email ? `EMAIL;TYPE=PREF,INTERNET:${email}` : '',
      url ? `URL:${url}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');
  }

  if (mapping.mode === 'url-template') {
    let result = mapping.urlTemplate || '';
    Object.entries(row).forEach(([key, val]) => {
      result = result.split(`{{${key}}}`).join(val ?? '');
    });
    return result.trim();
  }

  return (row[mapping.contentColumn] || '').trim();
}

export function sanitizeFilename(name: string, index: number): string {
  const prefix = String(index + 1).padStart(3, '0');
  const slug = (name || `qr-${prefix}`)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `${prefix}-${slug || 'code'}`;
}

export interface BatchTemplatePreset {
  id: string;
  name: string;
  description: string;
  filename: string;
  csv: string;
}

export const BATCH_TEMPLATES: BatchTemplatePreset[] = [
  {
    id: 'urls',
    name: 'Website URLs & Tables',
    description: 'Table tents, flyer links, or product landing pages with custom CTA labels',
    filename: '2qrcode-template-urls.csv',
    csv: [
      'label,url,cta_text',
      'Table-01,https://2qrcode.com/?table=1,VIEW MENU',
      'Table-02,https://2qrcode.com/?table=2,VIEW MENU',
      'Table-03,https://2qrcode.com/?table=3,VIEW MENU',
      'Storefront-Poster,https://2qrcode.com/?utm_source=window,SCAN ME',
      'Receipt-Review,https://2qrcode.com/?review=true,REVIEW US',
      'Packaging-Insert,https://2qrcode.com/?promo=VIP20,CLAIM 20% OFF',
    ].join('\n'),
  },
  {
    id: 'wifi',
    name: 'Multi-Room Wi-Fi Networks',
    description: 'Airbnb rentals, hotel rooms, or office floors with individual SSIDs',
    filename: '2qrcode-template-wifi.csv',
    csv: [
      'label,ssid,password,encryption',
      'Suite-101,GuestSuite101,Welcome2026!,WPA',
      'Suite-102,GuestSuite102,Sunrise2026!,WPA',
      'Lobby-Lounge,HotelLobbyFree,LoungePass88,WPA',
      'Conference-Room-A,BoardroomWiFi,SecureMeet99,WPA',
    ].join('\n'),
  },
  {
    id: 'vcard',
    name: 'Team vCard 3.0 Badges',
    description: 'Conference staff badges or corporate business cards from HR CSV export',
    filename: '2qrcode-template-vcards.csv',
    csv: [
      'label,firstName,lastName,phone,email,company,title,url',
      'Afzal-Naveed,Afzal,Naveed,+1-415-555-0101,afzal@2qrcode.com,2qrcode.com,Founder & Architect,https://2qrcode.com',
      'Sarah-Chen,Sarah,Chen,+1-415-555-0102,sarah@2qrcode.com,2qrcode.com,Head of Design,https://2qrcode.com',
      'Marcus-Vance,Marcus,Vance,+1-415-555-0103,marcus@2qrcode.com,2qrcode.com,Print Engineer,https://2qrcode.com',
      'Elena-Rostova,Elena,Rostova,+1-415-555-0104,elena@2qrcode.com,2qrcode.com,Enterprise Ops,https://2qrcode.com',
    ].join('\n'),
  },
  {
    id: 'sku',
    name: 'Warehouse SKU & Asset Tags',
    description: 'Inventory bins, retail SKUs, and serialized hardware asset stickers',
    filename: '2qrcode-template-skus.csv',
    csv: [
      'label,sku,product_name,url',
      'SKU-A1001,A1001,Espresso Grinder Pro,https://2qrcode.com/asset/A1001',
      'SKU-A1002,A1002,Stainless Pour Kettle,https://2qrcode.com/asset/A1002',
      'SKU-A1003,A1003,Digital Precision Scale,https://2qrcode.com/asset/A1003',
      'SKU-A1004,A1004,Thermal Carafe 1L,https://2qrcode.com/asset/A1004',
    ].join('\n'),
  },
];
