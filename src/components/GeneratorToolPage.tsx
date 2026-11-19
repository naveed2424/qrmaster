import { useState, useId, useDeferredValue, useEffect, useMemo } from 'react';
import {
  Star,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ExternalLink,
  Calendar,
  BookOpen,
  Tag,
  Check,
  ListChecks,
  Award,
  Link2,
} from 'lucide-react';
import { QRGeneratorTool, QRCustomization, SupportedLanguage } from '../types/qr';
import QRStudio from './QRStudio';
import { TRANSLATIONS } from '../data/translations';
import { getToolSeoGuide } from '../data/toolSeoGuides';
import fallbackPortrait from '../assets/images/founder_portrait_polished_1794521132031.jpg';

const FOUNDER_PORTRAIT = '/assets/aistudio/Portrait_dans_un_bureau_techno_inspirant_318ff21b.png';

function upsertToolMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

interface GeneratorToolPageProps {
  tool: QRGeneratorTool;
  currentLang: SupportedLanguage;
  customization: QRCustomization;
  onCustomizationChange: (newSettings: QRCustomization) => void;
  onSelectTool: (toolId: string) => void;
  onNavigate?: (viewId: string, postId?: string) => void;
  relatedTools: QRGeneratorTool[];
}

export default function GeneratorToolPage({
  tool,
  currentLang,
  customization,
  onCustomizationChange,
  onSelectTool,
  onNavigate,
  relatedTools,
}: GeneratorToolPageProps) {
  const t = TRANSLATIONS[currentLang];
  const [formValues, setFormValues] = useState<Record<string, any>>(tool.defaultValues);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(() => {
    return localStorage.getItem(`rated_${tool.id}`) === 'true';
  });
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Reset form defaults cleanly when switching between tools
  useEffect(() => {
    setFormValues(tool.defaultValues);
    setExpandedFaqIndex(0);
    setHasRated(localStorage.getItem(`rated_${tool.id}`) === 'true');
    setUserRating(0);
  }, [tool.id, tool.defaultValues]);

  const seoGuide = useMemo(() => getToolSeoGuide(tool.id), [tool.id]);

  const guideBlocks = useMemo(() => {
    if (!seoGuide) return [];
    return seoGuide.content.split('\n\n');
  }, [seoGuide]);

  const guideWordCount = useMemo(() => {
    if (!seoGuide) return 0;
    const allText = [
      seoGuide.headline,
      seoGuide.executiveSummary,
      ...seoGuide.keyTakeaways,
      seoGuide.content,
    ].join(' ');
    return allText.trim().split(/\s+/).filter(Boolean).length;
  }, [seoGuide]);

  const tableOfContents = useMemo(() => {
    return guideBlocks
      .map((block, idx) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('### ')) {
          return { id: `tool-sec-${idx}`, title: trimmed.replace('### ', '').trim() };
        }
        return null;
      })
      .filter((item): item is { id: string; title: string } => item !== null);
  }, [guideBlocks]);

  const allFaqs = useMemo(() => {
    if (!seoGuide?.expandedFaqs?.length) return tool.guide.faqs;
    return [...tool.guide.faqs, ...seoGuide.expandedFaqs];
  }, [tool.guide.faqs, seoGuide]);

  // Inject dynamic Schema.org @graph JSON-LD (SoftwareApplication + HowTo + TechArticle + FAQPage + BreadcrumbList + Person)
  useEffect(() => {
    const toolUrl = `https://2qrcode.com/?tool=${tool.id}`;
    const keywordsStr = seoGuide
      ? [seoGuide.primaryKeyword, ...seoGuide.longTailKeywords].join(', ')
      : `${tool.name} qr code generator, free static ${tool.id} qr code, 2qrcode.com`;

    upsertToolMeta('name', 'keywords', keywordsStr);
    upsertToolMeta('name', 'author', seoGuide?.author || 'Afzal Naveed');

    const graph: Record<string, unknown>[] = [
      {
        '@type': 'SoftwareApplication',
        name: `${tool.name} QR Code Generator`,
        url: toolUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        description: seoGuide?.metaDescription || tool.detailedDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.rating.toFixed(1),
          ratingCount: tool.ratingCount,
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'HowTo',
        name: `How to Create a Free ${tool.name} QR Code`,
        description: tool.guide.wayToUse,
        step: tool.guide.howToUse.map((stepText, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: `Step ${idx + 1}`,
          text: stepText,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'All QR Generators', item: 'https://2qrcode.com/' },
          { '@type': 'ListItem', position: 2, name: tool.category, item: 'https://2qrcode.com/' },
          { '@type': 'ListItem', position: 3, name: `${tool.name} QR Generator`, item: toolUrl },
        ],
      },
    ];

    if (allFaqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: allFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    if (seoGuide) {
      graph.push({
        '@type': 'TechArticle',
        mainEntityOfPage: { '@type': 'WebPage', '@id': toolUrl },
        headline: seoGuide.headline,
        description: seoGuide.metaDescription,
        wordCount: guideWordCount,
        keywords: keywordsStr,
        datePublished: '2026-11-19',
        dateModified: seoGuide.lastUpdated,
        author: {
          '@type': 'Person',
          name: seoGuide.author,
          jobTitle: seoGuide.authorRole,
          url: 'https://2qrcode.com/?view=about',
          image: `https://2qrcode.com${FOUNDER_PORTRAIT}`,
        },
        publisher: {
          '@type': 'Organization',
          name: '2qrcode.com',
          url: 'https://2qrcode.com/',
        },
      });
    }

    const existing = document.getElementById('tool-structured-data');
    const script = existing || document.createElement('script');
    script.id = 'tool-structured-data';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
    if (!existing) {
      document.head.appendChild(script);
    }

    return () => {
      const cleanup = document.getElementById('tool-structured-data');
      if (cleanup) cleanup.remove();
    };
  }, [tool, seoGuide, guideWordCount, allFaqs]);

  // Generate unique IDs for all form fields
  const fieldIdPrefix = useId();

  // Compute live payload string with useDeferredValue for ultra-fluid typing response
  const rawPayload = tool.defaultPayloadGenerator(formValues);
  const currentPayload = useDeferredValue(rawPayload);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleRateSubmit = (stars: number) => {
    setUserRating(stars);
    setHasRated(true);
    localStorage.setItem(`rated_${tool.id}`, 'true');
    const existing = JSON.parse(localStorage.getItem('qr_tool_ratings') || '{}');
    existing[tool.id] = stars;
    localStorage.setItem('qr_tool_ratings', JSON.stringify(existing));
  };

  const navigateTarget = (targetType: 'tool' | 'view' | 'post', targetId: string) => {
    if (targetType === 'tool') {
      onSelectTool(targetId);
    } else if (targetType === 'post') {
      if (onNavigate) {
        onNavigate('blog', targetId);
      } else {
        window.history.pushState(null, '', `?view=blog&post=${targetId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } else if (targetType === 'view') {
      if (onNavigate) {
        onNavigate(targetId);
      } else {
        onSelectTool(targetId);
      }
    }
  };

  const renderGuideInline = (text: string) => {
    const tokenRegex =
      /(\[[^\]]+\]\((?:(?:tool|view|post):[a-z0-9-]+|https?:\/\/[^\s)]+)\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/gi;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (!part) return null;

      const internalMatch = part.match(/^\[([^\]]+)\]\((tool|view|post):([a-z0-9-]+)\)$/i);
      if (internalMatch) {
        const [, label, targetTypeRaw, targetId] = internalMatch;
        const targetType = targetTypeRaw.toLowerCase() as 'tool' | 'view' | 'post';
        const href =
          targetType === 'view'
            ? `?view=${targetId}`
            : targetType === 'post'
            ? `?view=blog&post=${targetId}`
            : `?tool=${targetId}`;
        return (
          <a
            key={i}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              navigateTarget(targetType, targetId);
            }}
            className="text-amber-900 hover:text-amber-950 font-bold underline decoration-amber-700/60 underline-offset-4 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0" aria-hidden="true" />
          </a>
        );
      }

      const externalMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/i);
      if (externalMatch) {
        const [, label, url] = externalMatch;
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-900 hover:text-sky-950 font-semibold underline decoration-sky-700/50 underline-offset-4 inline-flex items-center gap-1 transition-colors"
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0" aria-hidden="true" />
          </a>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-stone-800">
            {part.slice(1, -1)}
          </em>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-[#FBF2E3] border border-[#E2CAA4] font-mono text-xs text-amber-900"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 space-y-12">
      {/* Breadcrumb & Tool Hero Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
          <button
            onClick={() => onSelectTool('overview')}
            className="hover:text-amber-950 transition-colors cursor-pointer"
          >
            All Generators
          </button>
          <span>/</span>
          <span className="capitalize text-stone-600">{tool.category}</span>
          <span>/</span>
          <span className="text-stone-900 font-extrabold">{tool.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
                <span className="text-gold-gradient">{tool.name}</span> QR Generator
              </h1>
              {tool.badge && (
                <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-md bg-amber-100/90 text-amber-900 border border-amber-700/25">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-base text-stone-700 max-w-2xl leading-relaxed">
              {tool.detailedDescription}
            </p>
          </div>

          {/* Individual Rating Badge & Stars */}
          <div className="p-4 bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-2xl shadow-[0_10px_28px_-10px_rgba(120,82,25,0.14)] flex items-center gap-3 shrink-0">
            <div className="flex items-center text-amber-600">
              <Star className="w-7 h-7 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-xl font-extrabold text-stone-900">
                  {tool.rating.toFixed(1)}
                </span>
                <span className="text-xs text-stone-600">/ 5.0</span>
              </div>
              <div className="text-[11px] text-stone-600 font-medium">
                {(tool.ratingCount + (hasRated ? 1 : 0)).toLocaleString()} verified ratings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Inputs & Live Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Dedicated Inputs for this specific tool (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl p-6 sm:p-7 shadow-[0_12px_36px_-12px_rgba(120,82,25,0.14)] space-y-5 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D0AC]">
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>Input Parameters</span>
            </h2>
            <span className="text-xs text-amber-800 font-mono font-bold">Live Auto-Encoding</span>
          </div>

          <div className="space-y-4">
            {tool.fields.map((field) => {
              const currentVal = formValues[field.id] ?? '';
              const inputElementId = `${fieldIdPrefix}-${field.id}`;

              if (field.type === 'select') {
                return (
                  <div key={field.id}>
                    <label htmlFor={inputElementId} className="block text-xs font-bold text-stone-800 mb-1.5">
                      {field.label} {field.required && <span className="text-amber-800">*</span>}
                    </label>
                    <select
                      id={inputElementId}
                      value={currentVal}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#D4B483] bg-white text-stone-900 focus:outline-hidden focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white text-stone-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field.id}>
                    <label htmlFor={inputElementId} className="block text-xs font-bold text-stone-800 mb-1.5">
                      {field.label} {field.required && <span className="text-amber-800">*</span>}
                    </label>
                    <textarea
                      id={inputElementId}
                      rows={3}
                      value={currentVal}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#D4B483] bg-white text-stone-900 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                    />
                    {field.helperText && (
                      <p className="text-[11px] text-stone-600 mt-1">{field.helperText}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'checkbox') {
                return (
                  <div key={field.id} className="flex items-center gap-2 pt-1">
                    <input
                      id={inputElementId}
                      type="checkbox"
                      checked={Boolean(currentVal)}
                      onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                      className="accent-amber-700 w-4 h-4 rounded-sm cursor-pointer"
                    />
                    <label htmlFor={inputElementId} className="text-xs font-bold text-stone-800 cursor-pointer">
                      {field.label}
                    </label>
                  </div>
                );
              }

              return (
                <div key={field.id}>
                  <label htmlFor={inputElementId} className="block text-xs font-bold text-stone-800 mb-1.5">
                    {field.label} {field.required && <span className="text-amber-800">*</span>}
                  </label>
                  <input
                    id={inputElementId}
                    type={field.type}
                    value={currentVal}
                    placeholder={field.placeholder}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#D4B483] bg-white text-stone-900 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                  />
                  {field.helperText && (
                    <p className="text-[11px] text-stone-600 mt-1">{field.helperText}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Raw Payload Preview for Transparency */}
          <div className="pt-3 border-t border-[#E6D0AC]">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Encoded Payload (Raw Matrix Data)
            </span>
            <div
              data-no-translate="true"
              className="p-3 bg-[#FBF2E3] rounded-xl border border-[#E2CAA4] font-mono text-[11px] text-amber-900 break-all select-all"
            >
              {currentPayload}
            </div>
          </div>

          {/* Interactive Rating Form for this specific tool */}
          <div className="p-4 bg-amber-100/90 border border-amber-700/25 rounded-2xl space-y-2">
            <span className="block text-xs font-bold text-amber-900">
              {hasRated ? t.thankYouRating : t.rateThisTool}
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={hasRated}
                  aria-label={`Rate ${star} out of 5 stars`}
                  onMouseEnter={() => !hasRated && setHoverRating(star)}
                  onMouseLeave={() => !hasRated && setHoverRating(0)}
                  onClick={() => handleRateSubmit(star)}
                  className={`p-1 transition-transform cursor-pointer ${hasRated ? 'cursor-default' : 'hover:scale-125'}`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      (hoverRating || userRating || (hasRated ? 5 : 0)) >= star
                        ? 'fill-amber-500 text-amber-600'
                        : 'text-stone-400'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
              {hasRated && (
                <span className="ml-2 text-xs font-extrabold text-amber-900 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Rated {userRating || 5}/5
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Full QR Customizer Studio (7 cols) */}
        <div className="lg:col-span-7">
          <QRStudio
            payload={currentPayload}
            toolName={tool.name}
            currentLang={currentLang}
            customization={customization}
            onCustomizationChange={onCustomizationChange}
          />
        </div>
      </div>

      {/* Comprehensive Documentation & Knowledge Guide Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#DFC7A0]">
        {/* Way to Use & Where to Use */}
        <div className="p-7 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl space-y-5 shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Primary Use Case</span>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">
              Purpose & Application
            </h3>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              {tool.guide.wayToUse}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E6D0AC]">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2.5">
              <MapPin className="w-4 h-4" />
              <span>Where to Use in Physical Print</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {tool.guide.whereToUse.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FBF2E3] rounded-xl border border-[#E2CAA4] font-semibold text-stone-800 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Use Step-by-Step */}
        <div className="p-7 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl space-y-4 shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)]">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Step-by-Step Instructions</span>
          </div>
          <h3 className="text-xl font-extrabold text-stone-900">
            4-Step Production Checklist
          </h3>

          <div className="space-y-3.5 pt-2">
            {tool.guide.howToUse.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5 text-xs leading-relaxed">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-stone-950 border border-amber-700/25 font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </span>
                <p className="text-stone-700 pt-0.5 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who Can Profit Mostly */}
      <div className="p-8 sm:p-10 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl shadow-[0_12px_36px_-12px_rgba(120,82,25,0.14)] space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
            Who Can Profit Mostly
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-stone-900">
            Target Audiences & <span className="text-gold-gradient">Business Growth Opportunities</span>
          </h3>
          <p className="text-xs text-stone-700 mt-1">
            Concrete ways practitioners convert QR scans into higher conversion rates and direct revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tool.guide.whoCanProfit.map((prof, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FBF2E3] border border-[#E2CAA4] hover:border-amber-700/45 space-y-2 transition-all shadow-xs"
            >
              <h4 className="text-sm font-extrabold text-amber-900 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 text-amber-800 shrink-0" />
                {prof.role}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">{prof.benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Long-Form E-E-A-T, LLM SEO & Field-Tested Photo Deep Dive (750+ Unique Words) */}
      {seoGuide && (
        <section
          aria-label={`${tool.name} Technical Engineering & SEO Playbook`}
          className="bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-3xl p-6 sm:p-10 shadow-[0_14px_40px_-12px_rgba(120,82,25,0.16)] space-y-8 backdrop-blur-xl"
        >
          {/* E-E-A-T & Metadata Header */}
          <div className="space-y-4 pb-6 border-b border-[#E6D0AC]">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-700/25 font-extrabold">
                <BookOpen className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                <span>Comprehensive {tool.name} Engineering Guide</span>
              </span>
              <span className="text-stone-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-700 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                Updated {seoGuide.lastUpdated}
              </span>
              <span className="text-stone-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-900 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                ISO/IEC 18004 Verified · {guideWordCount.toLocaleString()} Words
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
              <span className="text-gold-gradient">{seoGuide.headline}</span>
            </h2>

            {/* Clickable Author E-E-A-T Byline */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="?view=about"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTarget('view', 'about');
                }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <img
                  src={FOUNDER_PORTRAIT}
                  onError={(e) => {
                    e.currentTarget.src = fallbackPortrait;
                  }}
                  alt={`${seoGuide.author} — ${seoGuide.authorRole}`}
                  width={44}
                  height={44}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover object-top border border-amber-700/50 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900 flex items-center gap-1.5">
                    <span>{seoGuide.author}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-700/25">
                      Verified Architect
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-700">
                    {seoGuide.authorRole} · View Credentials &rarr;
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Executive Summary (AI / Answer Engine Citation Box) */}
          <div className="p-5 sm:p-6 bg-amber-100/80 border-2 border-amber-700/25 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-800" aria-hidden="true" />
              <span>Executive Overview &amp; Key Engineering Takeaways</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
              {seoGuide.executiveSummary}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-800">
              {seoGuide.keyTakeaways.map((takeaway, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-[#FFFDF9]/95 p-3 rounded-xl border border-[#DFC7A0]"
                >
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2 Realistic Field-Tested Photo Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seoGuide.images.map((imgItem, idx) => (
              <figure
                key={idx}
                className="rounded-2xl overflow-hidden border border-[#DFC7A0] bg-[#FBF2E3] shadow-md flex flex-col"
              >
                <img
                  src={imgItem.src}
                  alt={imgItem.alt}
                  width={1280}
                  height={720}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-video object-cover"
                />
                <figcaption className="px-4 py-3 text-xs text-stone-700 leading-relaxed bg-[#FBF2E3] border-t border-[#E6D0AC] flex-1">
                  {imgItem.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Interactive Table of Contents & Long-Tail Keyword Coverage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {tableOfContents.length > 0 && (
              <nav
                aria-label="In This Tool Guide"
                className="lg:col-span-7 p-4 sm:p-5 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl space-y-2.5"
              >
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
                  <ListChecks className="w-4 h-4 text-amber-800" aria-hidden="true" />
                  <span>In This {tool.name} Guide</span>
                </div>
                <ol className="space-y-1.5 text-xs">
                  {tableOfContents.map((section, sIdx) => (
                    <li key={section.id} className="flex items-start gap-2">
                      <span className="font-mono text-amber-800 font-bold shrink-0">
                        {String(sIdx + 1).padStart(2, '0')}.
                      </span>
                      <a
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(section.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="text-stone-800 hover:text-amber-900 font-semibold hover:underline transition-colors"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="lg:col-span-5 p-4 sm:p-5 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-amber-800" aria-hidden="true" />
                <span>Verified Topic &amp; Search Specs</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-md bg-amber-100 text-amber-950 border border-amber-700/30">
                  {seoGuide.primaryKeyword}
                </span>
                {seoGuide.longTailKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-[#FFFDF9] text-stone-800 border border-[#DFC7A0]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Full Tool Deep-Dive Article Body */}
          <div className="space-y-5 text-sm sm:text-base leading-relaxed text-stone-700">
            {guideBlocks.map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed === '---') {
                return <hr key={idx} className="border-[#E6D0AC] my-6" />;
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    id={`tool-sec-${idx}`}
                    className="scroll-mt-24 text-xl sm:text-2xl font-bold text-amber-900 pt-4 pb-1 border-b border-[#E6D0AC]"
                  >
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-base sm:text-lg font-bold text-stone-900 pt-3">
                    {trimmed.replace('#### ', '')}
                  </h4>
                );
              }
              if (trimmed.startsWith('- ')) {
                const items = trimmed.split('\n- ');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 text-sm sm:text-base text-stone-700">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {renderGuideInline(item.replace(/^- /, ''))}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split(/\n(?=\d+\.\s)/);
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-stone-700">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {renderGuideInline(item.replace(/^\d+\.\s/, ''))}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (trimmed.startsWith('| ')) {
                const rows = trimmed.split('\n').filter((r) => !r.includes(':---'));
                return (
                  <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-[#DFC7A0] bg-[#FBF2E3] p-2">
                    <table className="w-full text-left text-xs text-stone-700">
                      <tbody>
                        {rows.map((row, rIdx) => {
                          const cols = row
                            .split('|')
                            .filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                          return (
                            <tr
                              key={rIdx}
                              className={
                                rIdx === 0
                                  ? 'border-b border-amber-700/30 text-amber-900 font-bold'
                                  : 'border-b border-[#E6D0AC]'
                              }
                            >
                              {cols.map((col, cIdx) => (
                                <td key={cIdx} className="p-2.5 whitespace-nowrap">
                                  {renderGuideInline(col.trim())}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {renderGuideInline(trimmed)}
                </p>
              );
            })}
          </div>

          {/* Contextual Keyword Backlinks & Authority Citations Grid */}
          <div className="p-6 bg-gradient-to-br from-amber-100/80 via-[#FFFDF9] to-[#FBF2E3] border border-[#DFC7A0] rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
              <Link2 className="w-4 h-4 text-amber-800" aria-hidden="true" />
              <span>Recommended Tools, Guides &amp; Authoritative Reference Links</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {seoGuide.backlinks.map((linkItem, bIdx) => {
                const isExt = linkItem.targetType === 'external';
                const href = isExt
                  ? linkItem.target
                  : linkItem.targetType === 'view'
                  ? `?view=${linkItem.target}`
                  : linkItem.targetType === 'post'
                  ? `?view=blog&post=${linkItem.target}`
                  : `?tool=${linkItem.target}`;

                return (
                  <a
                    key={bIdx}
                    href={href}
                    target={isExt ? '_blank' : undefined}
                    rel={isExt ? 'noopener noreferrer' : undefined}
                    onClick={
                      isExt
                        ? undefined
                        : (e) => {
                            e.preventDefault();
                            navigateTarget(linkItem.targetType as 'tool' | 'view' | 'post', linkItem.target);
                          }
                    }
                    className="p-3.5 bg-white hover:bg-[#FBF2E3] border border-[#DFC7A0] hover:border-amber-700/50 rounded-xl text-left transition-all group cursor-pointer shadow-xs flex flex-col justify-between gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-2 text-xs font-bold text-amber-900 group-hover:text-amber-950">
                      <span className="leading-snug">{linkItem.anchorKeyword}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-800" aria-hidden="true" />
                    </div>
                    <p className="text-[11px] text-stone-700 leading-relaxed">{linkItem.contextNote}</p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Author E-E-A-T Credibility Box */}
          <div className="p-5 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={FOUNDER_PORTRAIT}
              onError={(e) => {
                e.currentTarget.src = fallbackPortrait;
              }}
              alt="Afzal Naveed — Founder & Senior QR Systems Architect"
              width={64}
              height={64}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover object-top border border-amber-700/40 shrink-0 shadow-sm"
            />
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="text-xs font-bold text-stone-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>Authored &amp; Technical-Reviewed by {seoGuide.author}</span>
                <Award className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Afzal Naveed is the founder and systems architect of 2qrcode.com, specializing in ISO/IEC 18004 QR algorithms, client-side Canvas rendering, GS1 Digital Link standards, and zero-tracking print workflows.
              </p>
              <a
                href="?view=about"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTarget('view', 'about');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline decoration-amber-700/50 underline-offset-4 cursor-pointer"
              >
                <span>Inspect Full Engineering Credentials</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Specific Tool Q&A / FAQs Accordion */}
      <div className="bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl p-6 sm:p-8 shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)] space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-800" aria-hidden="true" />
          <h3 className="text-xl font-extrabold text-stone-900">
            Frequently Asked Questions About {tool.name} QR Codes
          </h3>
        </div>

        <div className="divide-y divide-[#E6D0AC]">
          {allFaqs.map((faq, idx) => {
            const isOpen = expandedFaqIndex === idx;
            return (
              <div key={idx} className="py-4.5">
                <button
                  onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-700 shrink-0" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed pr-6">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Tools Carousel (Crawlable SEO Anchor Links) */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#DFC7A0]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-900">
              Related Generators in <span className="capitalize text-amber-800">{tool.category}</span>
            </h3>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onSelectTool('overview');
              }}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 cursor-pointer"
            >
              View All 70+ Tools &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {relatedTools.slice(0, 4).map((rel) => (
              <a
                key={rel.id}
                href={`?tool=${rel.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTool(rel.id);
                }}
                aria-label={`${rel.name} QR Generator — ${rel.shortDescription}`}
                className="p-4 text-left bg-[#FFFDF9]/92 border border-[#DFC7A0] hover:border-amber-700/50 rounded-2xl hover:shadow-[0_10px_24px_-8px_rgba(180,120,18,0.18)] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                    {rel.name}
                  </span>
                  <div className="flex items-center text-[11px] text-amber-900 font-mono">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-700" aria-hidden="true" />
                    <span>{rel.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                  {rel.shortDescription}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
