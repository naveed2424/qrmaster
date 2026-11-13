import { useState } from 'react';
import { Globe, Menu, X, Sun, Moon, ChevronDown, Check } from 'lucide-react';
import { SupportedLanguage } from '../types/qr';
import { TRANSLATIONS } from '../data/translations';
import BrandLogo from './BrandLogo';
import CountryFlag, { LANGUAGE_META } from './CountryFlag';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onQuickCreate: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const LANGUAGE_CODES: SupportedLanguage[] = [
  'en',
  'es',
  'fr',
  'de',
  'pt',
  'it',
  'ja',
  'ar',
  'zh',
  'hi',
  'ru',
  'ko',
  'tr',
  'id',
  'nl',
  'pl',
];

export default function Navbar({
  currentLang,
  onLanguageChange,
  activeView,
  onNavigate,
  onQuickCreate,
  isDark,
  onToggleTheme,
}: NavbarProps) {
  const t = TRANSLATIONS[currentLang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'directory', label: 'Generators' },
    { id: 'batch', label: 'Batch CSV' },
    { id: 'customizer', label: 'Studio' },
    { id: 'converter', label: 'Print Math' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'About' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-amber-500/25 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 h-18 sm:h-20">
        {/* Zone 1: Brand Logo */}
        <button
          onClick={() => onNavigate('directory')}
          className="text-left cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wide uppercase">
          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`whitespace-nowrap transition-all py-1.5 cursor-pointer ${
                  isActive
                    ? 'text-amber-400 font-extrabold border-b-2 border-amber-400 shadow-[0_2px_10px_rgba(251,191,36,0.3)]'
                    : 'text-zinc-400 hover:text-amber-300'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + High-Contrast Language Switcher + CTA + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-amber-500/50 hover:text-amber-300 transition-all cursor-pointer shadow-xs"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-200" />}
          </button>

          {/* Distinct High-Contrast Language Selector Button with Country Flag */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              aria-expanded={langDropdownOpen}
              aria-label="Select Language"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border-2 border-amber-400 bg-sky-50 hover:bg-white text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-md"
              title={`Language: ${LANGUAGE_META[currentLang].label}`}
            >
              <CountryFlag lang={currentLang} className="w-5 h-3.5" />
              <span className="uppercase font-mono text-[11px] font-black">{currentLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
            </button>

            {langDropdownOpen && (
              <>
                {/* Tap-outside backdrop for mobile & desktop */}
                <div
                  onClick={() => setLangDropdownOpen(false)}
                  className="fixed inset-0 bg-black/70 z-[90]"
                  aria-hidden="true"
                />

                {/* High-Contrast Ivory/Slate Language Picker Card (100% readable on phone & desktop) */}
                <div
                  role="dialog"
                  aria-label="Language Selector"
                  className="fixed inset-x-3 top-20 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-slate-50 text-slate-950 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] border-2 border-amber-500 z-[100] overflow-hidden"
                >
                  <div className="px-4 py-3 bg-slate-900 text-white border-b border-amber-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide">
                      <Globe className="w-4 h-4 text-amber-400" />
                      <span>Select Language (16)</span>
                    </div>
                    <button
                      onClick={() => setLangDropdownOpen(false)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-200 cursor-pointer"
                      aria-label="Close Language Menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 p-2.5 max-h-[65vh] overflow-y-auto">
                    {LANGUAGE_CODES.map((code) => {
                      const meta = LANGUAGE_META[code];
                      const active = currentLang === code;
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            onLanguageChange(code);
                            setLangDropdownOpen(false);
                          }}
                          className={`text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-1.5 cursor-pointer transition-all ${
                            active
                              ? 'bg-amber-400 text-slate-950 font-extrabold border-2 border-amber-600 shadow-sm'
                              : 'bg-white hover:bg-sky-100 text-slate-900 font-semibold border border-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <CountryFlag lang={code} className="w-5 h-3.5" />
                            <span className="truncate">{meta.label}</span>
                          </span>
                          {active ? (
                            <Check className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                          ) : (
                            <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">
                              {meta.countryCode}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onQuickCreate}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black rounded-xl text-[11px] sm:text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer"
          >
            <span className="sm:hidden">+ QR</span>
            <span className="hidden sm:inline">{t.quickCreate}</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen((prev) => !prev);
              setLangDropdownOpen(false);
            }}
            className="lg:hidden p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b-2 border-amber-500/40 px-4 py-4 space-y-4 max-h-[82vh] overflow-y-auto shadow-2xl">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black font-extrabold'
                      : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-amber-300 border border-zinc-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* High-Contrast Mobile Language Panel */}
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-950 border-2 border-amber-400 shadow-lg space-y-2.5">
            <div className="text-[11px] uppercase font-extrabold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                <span>Select Language &amp; Country</span>
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-amber-300">
                16 Languages
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
              {LANGUAGE_CODES.map((code) => {
                const meta = LANGUAGE_META[code];
                const active = currentLang === code;
                return (
                  <button
                    key={code}
                    onClick={() => {
                      onLanguageChange(code);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-400 text-slate-950 font-extrabold border-2 border-amber-600 shadow-xs'
                        : 'bg-white text-slate-900 font-semibold border border-slate-300 hover:bg-sky-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <CountryFlag lang={code} className="w-5 h-3.5" />
                      <span className="truncate">{meta.label}</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-600 shrink-0">
                      {meta.countryCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
