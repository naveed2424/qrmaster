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
      className={`bg-zinc-950/95 border border-zinc-800/90 hover:border-amber-500/35 rounded-2xl transition-colors backdrop-blur-md ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400">
            <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-amber-300">
              Editorial Briefing
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight text-balance">
            Subscribe to AI Insights
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Receive research-backed dispatches on AI in daily life, smart-city infrastructure, and Google Trends security briefings directly in your inbox.
          </p>
        </div>

        <div className="w-full lg:max-w-md shrink-0">
          {savedEmail ? (
            <div
              role="status"
              aria-live="polite"
              className="p-4 bg-zinc-900/90 border border-emerald-500/35 rounded-xl space-y-2"
            >
              <div className="flex items-start gap-2.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-white block">
                    Subscription confirmed
                  </span>
                  <span className="text-zinc-300">
                    Future AI Insights dispatches will go to{' '}
                    <span className="font-mono text-amber-300">{savedEmail}</span>.
                  </span>
                </div>
              </div>
              <div className="pl-6">
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-xs font-semibold text-zinc-400 hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer"
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
                  className={`flex-1 min-h-[44px] px-4 py-2.5 bg-black/70 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 transition-colors ${
                    error
                      ? 'border-rose-500/80 focus-visible:ring-rose-400/70'
                      : 'border-zinc-800 focus:border-amber-400/80'
                  }`}
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-xs sm:text-sm rounded-xl inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {error ? (
                <p
                  id="ai-insights-email-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-xs text-rose-400 pt-0.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </p>
              ) : (
                <p className="text-[11px] text-zinc-400 pt-0.5">
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
