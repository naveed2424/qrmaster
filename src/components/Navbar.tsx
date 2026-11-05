import { useState } from 'react';
import { Globe, Menu, X, Sun, Moon } from 'lucide-react';
import { SupportedLanguage } from '../types/qr';
import { TRANSLATIONS } from '../data/translations';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onQuickCreate: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

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

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'es', label: 'Español', flag: 'ES' },
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'de', label: 'Deutsch', flag: 'DE' },
    { code: 'pt', label: 'Português', flag: 'PT' },
    { code: 'it', label: 'Italiano', flag: 'IT' },
    { code: 'ja', label: '日本語', flag: 'JA' },
    { code: 'ar', label: 'العربية', flag: 'AR' },
  ];

  const navLinks = [
    { id: 'directory', label: 'Generators (60+)' },
    { id: 'customizer', label: 'Studio' },
    { id: 'converter', label: 'Metric Converter' },
    { id: 'blog', label: 'Blog & Tips' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'about', label: 'About' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-amber-500/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-20">
        {/* Zone 1: Reference-Inspired Brand Logo */}
        <button
          onClick={() => onNavigate('directory')}
          className="text-left cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: Single-line clean text links with golden hover */}
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

        {/* Zone 3: Language selector + Theme Toggle + Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-amber-500/40 hover:text-amber-300 transition-all cursor-pointer shadow-xs"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-300" />}
          </button>

          {/* Language selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs font-bold text-zinc-200 hover:border-amber-500/40 hover:text-amber-300 transition-all cursor-pointer shadow-xs"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase font-mono text-[11px]">{currentLang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-zinc-950 rounded-xl shadow-2xl border border-amber-500/30 py-1.5 z-50 backdrop-blur-md">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-zinc-900 cursor-pointer transition-colors ${
                      currentLang === l.code
                        ? 'text-amber-400 font-bold bg-amber-500/10'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="font-mono text-[10px] text-amber-400/70">{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Radiant Golden Action Button */}
          <button
            onClick={onQuickCreate}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black rounded-xl text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer"
          >
            {t.quickCreate}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-amber-400 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-amber-500/20 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold text-zinc-200 hover:bg-zinc-900 hover:text-amber-400 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
