import { useState, useId, useDeferredValue } from 'react';
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
} from 'lucide-react';
import { QRGeneratorTool, QRCustomization, SupportedLanguage } from '../types/qr';
import QRStudio from './QRStudio';
import { TRANSLATIONS } from '../data/translations';

interface GeneratorToolPageProps {
  tool: QRGeneratorTool;
  currentLang: SupportedLanguage;
  customization: QRCustomization;
  onCustomizationChange: (newSettings: QRCustomization) => void;
  onSelectTool: (toolId: string) => void;
  relatedTools: QRGeneratorTool[];
}

export default function GeneratorToolPage({
  tool,
  currentLang,
  customization,
  onCustomizationChange,
  onSelectTool,
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

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 space-y-12">
      {/* Breadcrumb & Tool Hero Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400/90">
          <button
            onClick={() => onSelectTool('overview')}
            className="hover:text-yellow-300 transition-colors cursor-pointer"
          >
            All Generators
          </button>
          <span>/</span>
          <span className="capitalize text-zinc-400">{tool.category}</span>
          <span>/</span>
          <span className="text-white font-extrabold">{tool.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                <span className="text-gold-gradient">{tool.name}</span> QR Generator
              </h1>
              {tool.badge && (
                <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-base text-zinc-400 max-w-2xl leading-relaxed">
              {tool.detailedDescription}
            </p>
          </div>

          {/* Individual Rating Badge & Stars */}
          <div className="p-4 bg-zinc-950 border border-amber-500/25 rounded-2xl shadow-xl flex items-center gap-3 shrink-0">
            <div className="flex items-center text-amber-400">
              <Star className="w-7 h-7 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-xl font-extrabold text-white">
                  {tool.rating.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-500">/ 5.0</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                {(tool.ratingCount + (hasRated ? 1 : 0)).toLocaleString()} verified ratings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Inputs & Live Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Dedicated Inputs for this specific tool (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-950/90 border border-amber-500/25 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Input Parameters</span>
            </h2>
            <span className="text-xs text-amber-400 font-mono font-bold">Live Auto-Encoding</span>
          </div>

          <div className="space-y-4">
            {tool.fields.map((field) => {
              const currentVal = formValues[field.id] ?? '';
              const inputElementId = `${fieldIdPrefix}-${field.id}`;

              if (field.type === 'select') {
                return (
                  <div key={field.id}>
                    <label htmlFor={inputElementId} className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {field.label} {field.required && <span className="text-amber-400">*</span>}
                    </label>
                    <select
                      id={inputElementId}
                      value={currentVal}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
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
                    <label htmlFor={inputElementId} className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {field.label} {field.required && <span className="text-amber-400">*</span>}
                    </label>
                    <textarea
                      id={inputElementId}
                      rows={3}
                      value={currentVal}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    {field.helperText && (
                      <p className="text-[11px] text-zinc-500 mt-1">{field.helperText}</p>
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
                      className="accent-amber-500 w-4 h-4 rounded-sm cursor-pointer"
                    />
                    <label htmlFor={inputElementId} className="text-xs font-bold text-zinc-300 cursor-pointer">
                      {field.label}
                    </label>
                  </div>
                );
              }

              return (
                <div key={field.id}>
                  <label htmlFor={inputElementId} className="block text-xs font-bold text-zinc-300 mb-1.5">
                    {field.label} {field.required && <span className="text-amber-400">*</span>}
                  </label>
                  <input
                    id={inputElementId}
                    type={field.type}
                    value={currentVal}
                    placeholder={field.placeholder}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  {field.helperText && (
                    <p className="text-[11px] text-zinc-500 mt-1">{field.helperText}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Raw Payload Preview for Transparency */}
          <div className="pt-3 border-t border-zinc-800">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Encoded Payload (Raw Matrix Data)
            </span>
            <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 font-mono text-[11px] text-amber-300 break-all select-all">
              {currentPayload}
            </div>
          </div>

          {/* Interactive Rating Form for this specific tool */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl space-y-2">
            <span className="block text-xs font-bold text-amber-300">
              {hasRated ? t.thankYouRating : t.rateThisTool}
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={hasRated}
                  onMouseEnter={() => !hasRated && setHoverRating(star)}
                  onMouseLeave={() => !hasRated && setHoverRating(0)}
                  onClick={() => handleRateSubmit(star)}
                  className={`p-1 transition-transform cursor-pointer ${hasRated ? 'cursor-default' : 'hover:scale-125'}`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      (hoverRating || userRating || (hasRated ? 5 : 0)) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                        : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
              {hasRated && (
                <span className="ml-2 text-xs font-extrabold text-amber-400 flex items-center gap-1">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-amber-500/20">
        {/* Way to Use & Where to Use */}
        <div className="p-7 bg-zinc-950 border border-amber-500/20 rounded-3xl space-y-5 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Primary Use Case</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Purpose & Application
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {tool.guide.wayToUse}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2.5">
              <MapPin className="w-4 h-4" />
              <span>Where to Use in Physical Print</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {tool.guide.whereToUse.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 font-semibold text-zinc-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Use Step-by-Step */}
        <div className="p-7 bg-zinc-950 border border-amber-500/20 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Step-by-Step Instructions</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            4-Step Production Checklist
          </h3>

          <div className="space-y-3.5 pt-2">
            {tool.guide.howToUse.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5 text-xs leading-relaxed">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 text-black font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </span>
                <p className="text-zinc-300 pt-0.5 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who Can Profit Mostly */}
      <div className="p-8 sm:p-10 bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            Who Can Profit Mostly
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Target Audiences & <span className="text-gold-gradient">Business Growth Opportunities</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Concrete ways practitioners convert QR scans into higher conversion rates and direct revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tool.guide.whoCanProfit.map((prof, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 space-y-2 transition-all shadow-xs"
            >
              <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                {prof.role}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{prof.benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Specific Tool Q&A / FAQs Accordion */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-extrabold text-white">
            Frequently Asked Questions About This Tool
          </h3>
        </div>

        <div className="divide-y divide-zinc-800">
          {tool.guide.faqs.map((faq, idx) => {
            const isOpen = expandedFaqIndex === idx;
            return (
              <div key={idx} className="py-4.5">
                <button
                  onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-zinc-100 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed pr-6">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Tools Carousel */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-amber-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">
              Related Generators in <span className="capitalize text-amber-400">{tool.category}</span>
            </h3>
            <button
              onClick={() => onSelectTool('overview')}
              className="text-xs font-bold text-amber-400 hover:text-yellow-300 cursor-pointer"
            >
              View All 60+ Tools &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {relatedTools.slice(0, 4).map((rel) => (
              <button
                key={rel.id}
                onClick={() => onSelectTool(rel.id)}
                className="p-4 text-left bg-zinc-950 border border-zinc-800 hover:border-amber-400/60 rounded-2xl hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-300">
                    {rel.name}
                  </span>
                  <div className="flex items-center text-[10px] text-amber-400 font-mono">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{rel.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {rel.shortDescription}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
