import { useState, FormEvent } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const SUBSCRIBER_STORAGE_KEY = '2qrcode_ai_insights_subscriber';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface SubscribeAIInsightsCTAProps {
  compact?: boolean;
}

export default function SubscribeAIInsightsCTA({ compact = false }: SubscribeAIInsightsCTAProps) {
  const [savedEmail, setSavedEmail] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return window.localStorage.getItem(SUBSCRIBER_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    setError('');
    setSavedEmail(trimmed);
    setEmail('');
    try {
      window.localStorage.setItem(SUBSCRIBER_STORAGE_KEY, trimmed);
    } catch {
      // Ignore storage quota errors in private browsing modes
    }
  };

  const handleChangeEmail = () => {
    setSavedEmail('');
    setError('');
    try {
      window.localStorage.removeItem(SUBSCRIBER_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <section
      aria-label="Subscribe to AI Insights"
      className={`bg-[#FFFDF9]/95 border border-[#DFC7A0] hover:border-amber-700/45 rounded-2xl transition-colors backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(120,82,25,0.12)] ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-amber-800">
            <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-amber-800">
              Editorial Briefing
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight text-balance">
            Subscribe to AI Insights
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Receive research-backed dispatches on AI in daily life, smart-city infrastructure, and Google Trends security briefings directly in your inbox.
          </p>
        </div>

        <div className="w-full lg:max-w-md shrink-0">
          {savedEmail ? (
            <div
              role="status"
              aria-live="polite"
              className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2"
            >
              <div className="flex items-start gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-stone-900 block">
                    Subscription confirmed
                  </span>
                  <span className="text-stone-700">
                    Future AI Insights dispatches will go to{' '}
                    <span className="font-mono font-bold text-amber-900">{savedEmail}</span>.
                  </span>
                </div>
              </div>
              <div className="pl-6">
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-xs font-semibold text-stone-600 hover:text-amber-900 underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Change email address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <label htmlFor="ai-insights-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="ai-insights-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@domain.com"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'ai-insights-email-error' : undefined}
                  className={`flex-1 min-h-[44px] px-4 py-2.5 bg-white border rounded-xl text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/70 transition-colors ${
                    error
                      ? 'border-rose-500 focus-visible:ring-rose-500/70'
                      : 'border-[#D4B483] focus:border-amber-700'
                  }`}
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 border border-amber-700/25 font-extrabold text-xs sm:text-sm rounded-xl inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-all shadow-[0_6px_18px_rgba(180,120,18,0.2)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {error ? (
                <p
                  id="ai-insights-email-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-xs text-rose-700 font-medium pt-0.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </p>
              ) : (
                <p className="text-[11px] text-stone-600 pt-0.5">
                  Zero spam. Unsubscribe anytime · No third-party tracking.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
