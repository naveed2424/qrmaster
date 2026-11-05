import { useState, useId } from 'react';
import { Ruler, Maximize2, Printer, CheckCircle, Info, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types/qr';
import { TRANSLATIONS } from '../data/translations';

interface MetricConverterProps {
  currentLang: SupportedLanguage;
}

export default function MetricConverter({ currentLang }: MetricConverterProps) {
  const t = TRANSLATIONS[currentLang];

  // Primary size state in millimeters
  const [mm, setMm] = useState<number>(35);
  // Expected scan distance in meters
  const [distanceMeters, setDistanceMeters] = useState<number>(1.5);
  const [distanceUnit, setDistanceUnit] = useState<'meters' | 'feet'>('meters');

  // Generate unique IDs for form labels
  const mmInputId = useId();
  const cmInputId = useId();
  const inInputId = useId();
  const px300InputId = useId();
  const px150InputId = useId();
  const px72InputId = useId();
  const scanDistanceInputId = useId();

  // Derived conversions
  const cm = Number((mm / 10).toFixed(2));
  const inches = Number((mm / 25.4).toFixed(3));
  const px300 = Math.round((mm / 25.4) * 300);
  const px150 = Math.round((mm / 25.4) * 150);
  const px72 = Math.round((mm / 25.4) * 72);

  // 10:1 distance rule math
  const actualDistanceM = distanceUnit === 'meters' ? distanceMeters : distanceMeters * 0.3048;
  const minRequiredMm = Math.max(20, Math.round((actualDistanceM / 10) * 1000));
  const optimalMm = Math.round(minRequiredMm * 1.25);
  const optimalInches = Number((optimalMm / 25.4).toFixed(2));
  const optimalPx300 = Math.round((optimalMm / 25.4) * 300);

  const presets = [
    { name: 'Business Card', dist: '0.25 m (10 in)', size: '20 - 25 mm', inSize: '0.8 - 1.0 in', notes: 'Keep payload simple' },
    { name: 'Restaurant Table Tent', dist: '0.5 m (20 in)', size: '35 - 45 mm', inSize: '1.4 - 1.8 in', notes: 'Best for digital menus' },
    { name: 'A4 Flyer / Brochure', dist: '0.75 m (2.5 ft)', size: '40 - 55 mm', inSize: '1.6 - 2.2 in', notes: 'Include clear CTA frame' },
    { name: 'Trade Show Roll-up', dist: '2.0 m (6.5 ft)', size: '150 - 200 mm', inSize: '6.0 - 8.0 in', notes: 'Place at eye/chest level' },
    { name: 'Storefront Window Sign', dist: '3.5 m (11.5 ft)', size: '250 - 350 mm', inSize: '10 - 14 in', notes: 'High contrast against glass' },
    { name: 'Outdoor Billboard', dist: '12.0 m (40 ft)', size: '1000 - 1400 mm', inSize: '40 - 55 in', notes: 'Scannable by pedestrians' },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2">
          <Ruler className="w-4 h-4" />
          <span>Professional Print Tool</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          <span className="text-gold-gradient">{t.metricConverterTitle}</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl leading-relaxed">
          {t.metricConverterSub}
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Interactive Metric & DPI Converter */}
        <div className="p-7 bg-zinc-950/90 border border-amber-500/25 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-amber-400" />
              <span>Dimension & Pixel Converter</span>
            </h3>
            <span className="text-xs font-mono font-bold text-amber-400">Live Recalculation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* MM */}
            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <label htmlFor={mmInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                Millimeters (mm)
              </label>
              <div className="relative">
                <input
                  id={mmInputId}
                  type="number"
                  min="10"
                  max="5000"
                  value={mm}
                  onChange={(e) => setMm(Math.max(5, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-sm font-mono font-bold rounded-lg border border-zinc-700 bg-zinc-950 text-amber-300 focus:outline-hidden focus:border-amber-400"
                />
                <span className="absolute right-2 top-2 text-xs text-zinc-500 pointer-events-none">mm</span>
              </div>
            </div>

            {/* CM */}
            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <label htmlFor={cmInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                Centimeters (cm)
              </label>
              <div className="relative">
                <input
                  id={cmInputId}
                  type="number"
                  step="0.1"
                  min="1"
                  value={cm}
                  onChange={(e) => setMm(Math.max(5, (Number(e.target.value) || 0) * 10))}
                  className="w-full px-2.5 py-1.5 text-sm font-mono font-bold rounded-lg border border-zinc-700 bg-zinc-950 text-amber-300 focus:outline-hidden focus:border-amber-400"
                />
                <span className="absolute right-2 top-2 text-xs text-zinc-500 pointer-events-none">cm</span>
              </div>
            </div>

            {/* Inches */}
            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <label htmlFor={inInputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                Inches (in)
              </label>
              <div className="relative">
                <input
                  id={inInputId}
                  type="number"
                  step="0.05"
                  min="0.4"
                  value={inches}
                  onChange={(e) => setMm(Math.max(5, Math.round((Number(e.target.value) || 0) * 25.4)))}
                  className="w-full px-2.5 py-1.5 text-sm font-mono font-bold rounded-lg border border-zinc-700 bg-zinc-950 text-amber-300 focus:outline-hidden focus:border-amber-400"
                />
                <span className="absolute right-2 top-2 text-xs text-zinc-500 pointer-events-none">in</span>
              </div>
            </div>

            {/* 300 DPI */}
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30">
              <label htmlFor={px300InputId} className="block text-[11px] font-bold text-amber-300 mb-1">
                300 DPI (Print)
              </label>
              <div className="relative">
                <input
                  id={px300InputId}
                  type="number"
                  value={px300}
                  readOnly
                  className="w-full px-2.5 py-1.5 text-sm font-mono font-extrabold rounded-lg border border-amber-500/40 bg-zinc-950 text-yellow-300"
                />
                <span className="absolute right-2 top-2 text-xs text-amber-400 font-bold">px</span>
              </div>
            </div>

            {/* 150 DPI */}
            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <label htmlFor={px150InputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                150 DPI (Draft)
              </label>
              <div className="relative">
                <input
                  id={px150InputId}
                  type="number"
                  value={px150}
                  readOnly
                  className="w-full px-2.5 py-1.5 text-sm font-mono font-medium rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-300"
                />
                <span className="absolute right-2 top-2 text-xs text-zinc-500">px</span>
              </div>
            </div>

            {/* 72 DPI */}
            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <label htmlFor={px72InputId} className="block text-[11px] font-bold text-zinc-300 mb-1">
                72 DPI (Screen)
              </label>
              <div className="relative">
                <input
                  id={px72InputId}
                  type="number"
                  value={px72}
                  readOnly
                  className="w-full px-2.5 py-1.5 text-sm font-mono font-medium rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-300"
                />
                <span className="absolute right-2 top-2 text-xs text-zinc-500">px</span>
              </div>
            </div>
          </div>

          {/* Quick Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-zinc-400 font-semibold">
              <span>20 mm (Min Card)</span>
              <span className="font-mono text-amber-400 font-extrabold">{mm} mm ({inches} in)</span>
              <span>200 mm (Banner)</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="1"
              value={Math.min(200, mm)}
              onChange={(e) => setMm(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Visual Scale Indicator */}
          <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-300">Physical Scale Simulation</span>
              <p className="text-xs text-zinc-400">
                A QR code of <strong className="text-white font-mono">{mm}mm</strong> has a diagonal area of <span className="font-mono text-amber-400">{Math.round(mm * 1.414)}mm</span>.
              </p>
            </div>
            <div
              style={{
                width: `${Math.min(70, Math.max(22, mm * 0.7))}px`,
                height: `${Math.min(70, Math.max(22, mm * 0.7))}px`,
              }}
              className="bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center text-black text-xs font-mono font-extrabold shrink-0 transition-all duration-150"
            >
              QR
            </div>
          </div>
        </div>

        {/* Right: 10:1 Scan Distance Rule Calculator */}
        <div className="p-7 bg-zinc-950/90 border border-amber-500/25 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.distanceCalculator}</span>
            </h3>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-xl text-xs">
              <button
                onClick={() => setDistanceUnit('meters')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  distanceUnit === 'meters'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Meters (m)
              </button>
              <button
                onClick={() => setDistanceUnit('feet')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  distanceUnit === 'feet'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Feet (ft)
              </button>
            </div>
          </div>

          <div>
            <label htmlFor={scanDistanceInputId} className="block text-xs font-bold text-zinc-300 mb-1.5">
              {t.scanDistance}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  id={scanDistanceInputId}
                  type="number"
                  step="0.2"
                  min="0.2"
                  max="100"
                  value={distanceMeters}
                  onChange={(e) => setDistanceMeters(Math.max(0.1, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 text-base font-mono font-extrabold rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:outline-hidden focus:border-amber-400"
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-amber-400">
                  {distanceUnit === 'meters' ? 'm' : 'ft'}
                </span>
              </div>
              <button
                onClick={() => setMm(optimalMm)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black font-extrabold rounded-xl text-xs uppercase tracking-wide whitespace-nowrap transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                Apply to Converter
              </button>
            </div>
          </div>

          {/* Results Box in Gold */}
          <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Optimal Print Size for {distanceMeters} {distanceUnit}:
                </h4>
                <div className="mt-1 flex items-baseline gap-2 font-mono text-2xl font-extrabold text-amber-300">
                  <span>{optimalMm} mm</span>
                  <span className="text-sm font-normal text-zinc-400">({optimalInches} in)</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  At 300 DPI, export canvas should be at least <strong className="font-mono text-amber-400">{optimalPx300} × {optimalPx300} px</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{t.ratioNotice}</span>
          </div>
        </div>
      </div>

      {/* Preset Standards Table */}
      <div className="bg-zinc-950/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Standard Physical Print Reference Guide
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Certified guidelines for commercial graphic designers and print shops
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-200 hover:border-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Guide</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-amber-400 font-extrabold uppercase tracking-wider">
                <th className="py-3 px-3">Print Medium</th>
                <th className="py-3 px-3">Typical Scan Distance</th>
                <th className="py-3 px-3">Recommended Metric Width</th>
                <th className="py-3 px-3">Imperial Width</th>
                <th className="py-3 px-3">Design Tips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300 font-medium">
              {presets.map((p) => (
                <tr key={p.name} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-white">{p.name}</td>
                  <td className="py-3.5 px-3 font-mono text-zinc-400">{p.dist}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-amber-300">{p.size}</td>
                  <td className="py-3.5 px-3 font-mono text-zinc-400">{p.inSize}</td>
                  <td className="py-3.5 px-3 text-zinc-400">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
