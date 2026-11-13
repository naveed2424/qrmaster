import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie } from 'lucide-react';

interface CookieConsentBannerProps {
  onNavigate: (view: string) => void;
}

const CONSENT_KEY = '2qrcode_cookie_consent';

export default function CookieConsentBanner({ onNavigate }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      setVisible(true);
    }

    const openHandler = () => setVisible(true);
    window.addEventListener('2qrcode-open-cookie-settings', openHandler);
    return () => window.removeEventListener('2qrcode-open-cookie-settings', openHandler);
  }, []);

  const handleSave = (mode: 'all' | 'essential') => {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ mode, updatedAt: new Date().toISOString() })
    );
    if (typeof window !== 'undefined') {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.requestNonPersonalizedAds = mode === 'essential' ? 1 : 0;
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and Advertising Preferences"
      className="fixed bottom-3 inset-x-3 sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-md z-[80] bg-slate-950 border-2 border-amber-400/70 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-extrabold text-white flex items-center gap-1.5">
            <span>Privacy &amp; AdSense Cookies</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Your QR code inputs stay 100% private inside your browser. To keep 2qrcode.com free forever, Google AdSense uses cookies for ad delivery and measurement.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          onClick={() => {
            onNavigate('cookies');
            setVisible(false);
          }}
          className="text-[11px] font-semibold text-amber-300 underline hover:text-yellow-200 cursor-pointer"
        >
          Cookie Policy &amp; Opt-Out
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => handleSave('essential')}
            className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleSave('all')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-yellow-300 text-black text-xs font-extrabold cursor-pointer transition-colors shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
