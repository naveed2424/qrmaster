import { useEffect, useRef, useState, useId, useDeferredValue } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Printer,
  Sparkles,
  Upload,
  X,
  Palette,
  Layers,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { QRCustomization, SupportedLanguage } from '../types/qr';
import {
  renderQRToCanvas,
  exportHighResCanvas,
  downloadCanvasAsSvg,
  copyCanvasToClipboard,
  PRESET_LOGOS,
} from '../utils/qrCanvas';
import { TRANSLATIONS } from '../data/translations';

interface QRStudioProps {
  payload: string;
  toolName?: string;
  currentLang: SupportedLanguage;
  customization: QRCustomization;
  onCustomizationChange: (newSettings: QRCustomization) => void;
}

export default function QRStudio({
  payload,
  toolName,
  currentLang,
  customization,
  onCustomizationChange,
}: QRStudioProps) {
  const t = TRANSLATIONS[currentLang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'logo' | 'frame'>('design');

  // Deferred values for ultra-fluid 60fps rendering without UI thread blocking
  const deferredPayload = useDeferredValue(payload);
  const deferredCustomization = useDeferredValue(customization);

  // Generate unique IDs for form labels
  const fgColorInputId = useId();
  const gradColor2InputId = useId();
  const bgColorInputId = useId();
  const eyeFrameColorInputId = useId();
  const eyeBallColorInputId = useId();
  const frameColorInputId = useId();
  const frameTextInputId = useId();

  // Re-render QR code canvas via requestAnimationFrame for fluid performance
  useEffect(() => {
    let animId: number;
    let cancelled = false;

    animId = requestAnimationFrame(() => {
      if (cancelled || !canvasRef.current) return;
      renderQRToCanvas(canvasRef.current, deferredPayload, deferredCustomization);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [deferredPayload, deferredCustomization]);

  const update = (patch: Partial<QRCustomization>) => {
    onCustomizationChange({ ...customization, ...patch });
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      update({ customLogoUrl: url, logoPreset: null, errorCorrection: 'H' });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (type: 'png' | 'jpg' | 'svg') => {
    const filename = `${(toolName || 'qr-code').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${type}`;
    if (type === 'svg') {
      await downloadCanvasAsSvg(payload, customization, filename);
    } else {
      await exportHighResCanvas(payload, customization, type, filename);
    }
    // Launch festive gold confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#fbbf24', '#f59e0b', '#fef08a', '#ffffff', '#ca8a04'],
      });
    } catch {
      // Ignore
    }
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - 2qrcode.com</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 90vh; margin: 0; background: white; }
            img { max-width: 320px; height: auto; border: 1px solid #ddd; padding: 12px; }
            p { color: #666; font-size: 13px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="QR Code" />
          <p>Generated with 2qrcode.com · Ready for scanning</p>
        </body>
      </html>
    `);
    doc.close();
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => iframe.remove(), 1000);
    };
  };

  return (
    <div className="bg-zinc-950/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-gold-gradient">{t.studioTitle}</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personalize your QR code colors, shape, logo, and Call-to-Action frame.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('design')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'design'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            Design & Color
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'logo'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            Logo & Brand
          </button>
          <button
            onClick={() => setActiveTab('frame')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'frame'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            Frame & CTA
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: DESIGN & COLOR */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              {/* Color Presets */}
              <div>
                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-2.5">
                  Luminous Color Palettes
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Imperial Gold', fg: '#facc15', bg: '#000000', grad: '#ca8a04', name: '👑 Imperial Gold' },
                    { label: 'Radiant Amber', fg: '#fbbf24', bg: '#09090b', grad: '#d97706', name: '🌟 Radiant Amber' },
                    { label: 'Champagne White', fg: '#ffffff', bg: '#09090b', grad: '#fde047', name: '✨ Champagne' },
                    { label: 'Cyber Emerald', fg: '#10b981', bg: '#050505', grad: '#047857', name: '💎 Emerald' },
                    { label: 'Electric Blue', fg: '#38bdf8', bg: '#030712', grad: '#0284c7', name: '⚡ Cyber Blue' },
                    { label: 'Light Gold on White', fg: '#b45309', bg: '#ffffff', grad: '#78350f', name: '☀️ Gold White' },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        update({
                          fgColor: p.fg,
                          bgColor: p.bg,
                          gradientColor2: p.grad,
                          eyeFrameColor: p.fg,
                          eyeBallColor: p.fg,
                          frameColor: p.fg,
                          frameTextColor: p.bg === '#ffffff' ? '#ffffff' : '#000000',
                        })
                      }
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-zinc-800 hover:border-amber-400/60 flex items-center gap-2 transition-all bg-zinc-900/90 text-zinc-200 cursor-pointer shadow-xs"
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: p.fg }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Color Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Foreground */}
                <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700">
                  <label htmlFor={fgColorInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Pattern Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={fgColorInputId}
                      type="color"
                      value={customization.fgColor}
                      onChange={(e) => update({ fgColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      {customization.fgColor}
                    </span>
                  </div>
                </div>

                {/* Gradient Color 2 */}
                <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={gradColor2InputId} className="text-[11px] font-bold text-zinc-300">
                      Gradient Color
                    </label>
                    <input
                      type="checkbox"
                      checked={customization.useGradient}
                      onChange={(e) => update({ useGradient: e.target.checked })}
                      className="accent-amber-500 rounded-sm cursor-pointer"
                      title="Toggle gradient"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={gradColor2InputId}
                      type="color"
                      disabled={!customization.useGradient}
                      value={customization.gradientColor2}
                      onChange={(e) => update({ gradientColor2: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 p-0 disabled:opacity-30 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      {customization.gradientColor2}
                    </span>
                  </div>
                </div>

                {/* Background */}
                <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700">
                  <label htmlFor={bgColorInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={bgColorInputId}
                      type="color"
                      value={customization.bgColor}
                      onChange={(e) => update({ bgColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      {customization.bgColor}
                    </span>
                  </div>
                </div>

                {/* Eye Frame Color */}
                <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700">
                  <label htmlFor={eyeFrameColorInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Eye Outer Frame
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={eyeFrameColorInputId}
                      type="color"
                      value={customization.eyeFrameColor || customization.fgColor}
                      onChange={(e) => update({ eyeFrameColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      {customization.eyeFrameColor || customization.fgColor}
                    </span>
                  </div>
                </div>

                {/* Eye Ball Color */}
                <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700">
                  <label htmlFor={eyeBallColorInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Eye Inner Pupil
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={eyeBallColorInputId}
                      type="color"
                      value={customization.eyeBallColor || customization.fgColor}
                      onChange={(e) => update({ eyeBallColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      {customization.eyeBallColor || customization.fgColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dot Matrix Style */}
              <div>
                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-2">
                  Dot Matrix Pattern
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'square', label: 'Classic Square', desc: 'Standard crisp' },
                    { id: 'rounded', label: 'Soft Rounded', desc: 'Modern curve' },
                    { id: 'dots', label: 'Circular Dots', desc: 'Smooth nodes' },
                    { id: 'classy', label: 'Classy Diamond', desc: 'Luxury jewel' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => update({ dotStyle: s.id as any })}
                      className={`p-3 text-left rounded-2xl border transition-all cursor-pointer ${
                        customization.dotStyle === s.id
                          ? 'border-amber-400 bg-amber-500/15 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                          : 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Eye Shapes */}
              <div>
                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-2">
                  Eye Corner Geometry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'square', label: 'Square Eyes' },
                    { id: 'rounded', label: 'Rounded Eyes' },
                    { id: 'extra-rounded', label: 'Squircle Eyes' },
                    { id: 'circle', label: 'Circular Eyes' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => update({ cornerStyle: c.id as any })}
                      className={`py-2.5 px-3 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        customization.cornerStyle === c.id
                          ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                          : 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Correction Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                    Error Correction Level
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Recommended: Level H for Logos
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'L', label: 'Level L', desc: '7% recovery' },
                    { id: 'M', label: 'Level M', desc: '15% recovery' },
                    { id: 'Q', label: 'Level Q', desc: '25% recovery' },
                    { id: 'H', label: 'Level H', desc: '30% recovery' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => update({ errorCorrection: lvl.id as any })}
                      className={`p-2.5 text-center rounded-xl border text-xs transition-all cursor-pointer ${
                        customization.errorCorrection === lvl.id
                          ? 'border-amber-400 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-bold">{lvl.label}</div>
                      <div className="text-[10px] opacity-80">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGO & BRANDING */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              {/* Custom Logo Upload */}
              <div className="p-6 border-2 border-dashed border-amber-500/30 rounded-2xl bg-zinc-900/60 text-center space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleCustomLogoUpload}
                  className="hidden"
                />

                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                    <Upload className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {t.uploadCustomLogo}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Supports PNG, JPG, or SVG with automatic centered protective mask
                  </p>
                </div>

                <div className="flex justify-center gap-2 pt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.35)] cursor-pointer"
                  >
                    Select Logo File
                  </button>
                  {(customization.customLogoUrl || customization.logoPreset) && (
                    <button
                      onClick={() => update({ customLogoUrl: null, logoPreset: null })}
                      className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Preset Brand Logos */}
              <div>
                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-2.5">
                  Popular Brand Mark Presets
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {Object.entries(PRESET_LOGOS).map(([key, item]) => {
                    const isSelected = customization.logoPreset === key && !customization.customLogoUrl;
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          update({
                            logoPreset: isSelected ? null : key,
                            customLogoUrl: null,
                            errorCorrection: 'H',
                          })
                        }
                        className={`p-2.5 flex items-center gap-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                            : 'border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div
                          className="w-5 h-5 shrink-0 flex items-center justify-center text-amber-400"
                          dangerouslySetInnerHTML={{ __html: item.svg }}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logo Size Percentage */}
              {(customization.logoPreset || customization.customLogoUrl) && (
                <div className="p-4 bg-zinc-900/90 rounded-2xl space-y-2 border border-zinc-800">
                  <div className="flex justify-between text-xs font-bold text-zinc-200">
                    <span>Center Logo Scale</span>
                    <span className="font-mono text-amber-400 font-extrabold">
                      {customization.logoSizePercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="28"
                    value={customization.logoSizePercent}
                    onChange={(e) => update({ logoSizePercent: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-zinc-400">
                    Reed-Solomon Error Correction Level H (30% parity) is locked to guarantee error-free scanning with center logos.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FRAME & CALL TO ACTION */}
          {activeTab === 'frame' && (
            <div className="space-y-6">
              {/* Frame Styles */}
              <div>
                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-2.5">
                  Frame Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'none', label: 'No Frame (Clean)' },
                    { id: 'bottom-bar', label: 'Bottom Ribbon Pill' },
                    { id: 'top-header', label: 'Top Header Banner' },
                    { id: 'polaroid', label: 'Polaroid Card' },
                    { id: 'badge', label: 'Compact Badge' },
                    { id: 'minimal-tag', label: 'Minimalist Border' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => update({ frameType: f.id as any })}
                      className={`p-3 text-left rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        customization.frameType === f.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                          : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {customization.frameType !== 'none' && (
                <>
                  {/* CTA Text */}
                  <div>
                    <label htmlFor={frameTextInputId} className="block text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-1.5">
                      Frame Banner Call-To-Action
                    </label>
                    <input
                      id={frameTextInputId}
                      type="text"
                      maxLength={28}
                      value={customization.frameText}
                      onChange={(e) => update({ frameText: e.target.value })}
                      placeholder="e.g., SCAN ME, CONNECT WI-FI, VIEW MENU"
                      className="w-full px-4 py-2.5 text-sm font-extrabold uppercase tracking-wider rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />

                    {/* Quick CTA suggestions */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[
                        'SCAN ME',
                        'CONNECT TO WI-FI',
                        'VIEW MENU',
                        'SAVE CONTACT',
                        'DOWNLOAD APP',
                        'PAY NOW',
                        'VISIT WEBSITE',
                        'CLAIM 20% OFF',
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => update({ frameText: chip })}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Color */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800">
                      <label htmlFor={frameColorInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                        Frame Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id={frameColorInputId}
                          type="color"
                          value={customization.frameColor}
                          onChange={(e) => update({ frameColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 p-0 bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                          {customization.frameColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Live Preview & Download Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-5 bg-black/60 p-6 sm:p-7 rounded-3xl border border-amber-500/20 backdrop-blur-md shadow-2xl">
          <div className="w-full flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Live Vector Preview
            </span>
            <span className="font-mono text-[11px] text-zinc-400">{customization.size} × {customization.size} px</span>
          </div>

          {/* Canvas Wrapper */}
          <div className="p-4 bg-zinc-950 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.9)] border border-amber-500/30 flex items-center justify-center max-w-full overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-[280px] sm:max-w-[320px] h-auto object-contain transition-transform duration-200 hover:scale-[1.01]"
            />
          </div>

          {/* Size / Resolution selector */}
          <div className="w-full flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-zinc-300">Export Res:</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: '512px', size: 512 },
                { label: '1024px', size: 1024 },
                { label: '2048px (Print)', size: 2048 },
              ].map((res) => (
                <button
                  key={res.size}
                  onClick={() => update({ size: res.size })}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    customization.size === res.size
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-xs'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="w-full space-y-2 pt-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDownload('png')}
                className="py-3 px-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                title="Download high-resolution PNG image"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PNG</span>
              </button>
              <button
                onClick={() => handleDownload('svg')}
                className="py-3 px-2 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Download scalable vector SVG"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">SVG Vector</span>
              </button>
              <button
                onClick={() => handleDownload('jpg')}
                className="py-3 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Download JPG image"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">JPG</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className="w-full py-2.5 px-3 border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Image!' : t.copyImage}</span>
              </button>
              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-3 border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printCode}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-center text-amber-400/80 font-medium">
            100% Free · No sign-up required · Unlimited lifetime scans
          </div>
        </div>
      </div>
    </div>
  );
}
