import { useState } from 'react';
import { Globe, Menu, X, Sparkles, Sun, ChevronDown, Check } from 'lucide-react';
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

const NAV_LINK_LABELS: Record<
  SupportedLanguage,
  { directory: string; batch: string; customizer: string; converter: string; blog: string; about: string; faqs: string }
> = {
  en: { directory: 'Generators', batch: 'Batch CSV', customizer: 'Studio', converter: 'Print Math', blog: 'Blog', about: 'About', faqs: 'FAQs' },
  es: { directory: 'Generadores', batch: 'CSV Lote', customizer: 'Estudio', converter: 'Métricas', blog: 'Blog', about: 'Acerca de', faqs: 'FAQ' },
  fr: { directory: 'Générateurs', batch: 'CSV Lot', customizer: 'Studio', converter: 'Calculateur', blog: 'Blog', about: 'À Propos', faqs: 'FAQ' },
  de: { directory: 'Generatoren', batch: 'CSV Stapel', customizer: 'Studio', converter: 'Druckmaß', blog: 'Blog', about: 'Über uns', faqs: 'FAQ' },
  pt: { directory: 'Geradores', batch: 'CSV Lote', customizer: 'Estúdio', converter: 'Métricas', blog: 'Blog', about: 'Sobre', faqs: 'FAQ' },
  it: { directory: 'Generatori', batch: 'CSV Multiplo', customizer: 'Studio', converter: 'Calcolatore', blog: 'Blog', about: 'Chi siamo', faqs: 'FAQ' },
  ja: { directory: '生成ツール', batch: 'CSV一括', customizer: 'スタジオ', converter: '印刷計算', blog: 'ブログ', about: '運営者', faqs: 'FAQ' },
  ar: { directory: 'المولدات', batch: 'CSV دفعة', customizer: 'الاستوديو', converter: 'حاسبة الطباعة', blog: 'المدونة', about: 'من نحن', faqs: 'الأسئلة' },
  zh: { directory: '生成器', batch: '批量CSV', customizer: '工作室', converter: '印刷尺寸', blog: '博客', about: '关于', faqs: '常见问题' },
  hi: { directory: 'जनरेटर', batch: 'बैच CSV', customizer: 'स्टूडियो', converter: 'प्रिंट माप', blog: 'ब्लॉग', about: 'परिचय', faqs: 'सवाल-जवाब' },
  ru: { directory: 'Генераторы', batch: 'Пакет CSV', customizer: 'Студия', converter: 'Печать', blog: 'Блог', about: 'О нас', faqs: 'FAQ' },
  ko: { directory: '생성기', batch: '일괄 CSV', customizer: '스튜디오', converter: '인쇄 계산', blog: '블로그', about: '소개', faqs: 'FAQ' },
  tr: { directory: 'Oluşturucular', batch: 'Toplu CSV', customizer: 'Stüdyo', converter: 'Baskı Hesap', blog: 'Blog', about: 'Hakkında', faqs: 'SSS' },
  id: { directory: 'Generator', batch: 'CSV Massal', customizer: 'Studio', converter: 'Ukur Cetak', blog: 'Blog', about: 'Tentang', faqs: 'FAQ' },
  nl: { directory: 'Generatoren', batch: 'Batch CSV', customizer: 'Studio', converter: 'Printmaat', blog: 'Blog', about: 'Over ons', faqs: 'FAQ' },
  pl: { directory: 'Generatory', batch: 'CSV Masowo', customizer: 'Studio', converter: 'Wydruk', blog: 'Blog', about: 'O nas', faqs: 'FAQ' },
};

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
  const nl = NAV_LINK_LABELS[currentLang] || NAV_LINK_LABELS.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'directory', label: nl.directory },
    { id: 'batch', label: nl.batch },
    { id: 'customizer', label: nl.customizer },
    { id: 'converter', label: nl.converter },
    { id: 'blog', label: nl.blog },
    { id: 'about', label: nl.about },
    { id: 'faqs', label: nl.faqs },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FBF4E7]/95 backdrop-blur-xl border-b border-[#DFC69C] transition-all shadow-[0_6px_28px_rgba(120,82,25,0.10)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 h-18 sm:h-20">
        {/* Zone 1: Brand Logo */}
        <a
          href="/"
          aria-label="2qrcode.com Home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('directory');
          }}
          className="text-left cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
        >
          <BrandLogo size="md" />
        </a>

        {/* Zone 2: Desktop Nav */}
        <nav aria-label="Primary Navigation" data-no-translate="true" className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold tracking-wide uppercase">
          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            const href = link.id === 'directory' ? '/' : `?view=${link.id}`;
            return (
              <a
                key={link.id}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
                className={`whitespace-nowrap transition-all py-1.5 cursor-pointer ${
                  isActive
                    ? 'text-amber-800 font-extrabold border-b-2 border-amber-700'
                    : 'text-stone-700 hover:text-amber-800'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Champagne Tone Toggle + High-Contrast Language Switcher + CTA + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Champagne Silk / Pearl Tone Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-xl border border-[#D9BE91] bg-[#FFFDF8] text-amber-800 hover:border-amber-600 hover:bg-[#FAF0DE] transition-all cursor-pointer shadow-xs"
            title={isDark ? 'Switch to Warm Silk Champagne' : 'Switch to Pearl Champagne'}
            aria-label="Switch Champagne Background Tone"
          >
            {isDark ? <Sparkles className="w-4 h-4 text-amber-700" aria-hidden="true" /> : <Sun className="w-4 h-4 text-amber-700" aria-hidden="true" />}
          </button>

          {/* High-Contrast Language Selector Button with Country Flag */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              aria-expanded={langDropdownOpen}
              aria-label="Select Language"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-[#CFA96D] bg-[#FFFDF8] hover:bg-white text-stone-900 text-xs font-extrabold transition-all cursor-pointer shadow-xs"
              title={`Language: ${LANGUAGE_META[currentLang].label}`}
            >
              <CountryFlag lang={currentLang} className="w-5 h-3.5" />
              <span data-no-translate="true" className="uppercase font-mono text-[11px] font-black">{currentLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-700" aria-hidden="true" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  onClick={() => setLangDropdownOpen(false)}
                  className="fixed inset-0 bg-stone-900/35 backdrop-blur-xs z-[90]"
                  aria-hidden="true"
                />

                <div
                  role="dialog"
                  aria-label="Language Selector"
                  className="fixed inset-x-3 top-20 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-[#FFFDF9] text-stone-900 rounded-2xl shadow-[0_24px_60px_rgba(120,82,25,0.25)] border-2 border-[#D4B075] z-[100] overflow-hidden"
                >
                  <div className="px-4 py-3 bg-[#F4E3C7] text-stone-900 border-b border-[#D8B986] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide">
                      <Globe className="w-4 h-4 text-amber-800" aria-hidden="true" />
                      <span>Select Language (16)</span>
                    </div>
                    <button
                      onClick={() => setLangDropdownOpen(false)}
                      className="p-1 rounded-lg bg-[#FFFDF9] hover:bg-amber-100 text-stone-800 cursor-pointer border border-[#D8B986]"
                      aria-label="Close Language Menu"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div data-no-translate="true" className="grid grid-cols-2 gap-1.5 p-2.5 max-h-[65vh] overflow-y-auto">
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
                              ? 'bg-amber-400 text-stone-950 font-extrabold border-2 border-amber-700 shadow-xs'
                              : 'bg-white hover:bg-[#FAF0DE] text-stone-900 font-semibold border border-[#E5D0AE]'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <CountryFlag lang={code} className="w-5 h-3.5" />
                            <span className="truncate">{meta.label}</span>
                          </span>
                          {active ? (
                            <Check className="w-3.5 h-3.5 text-stone-950 shrink-0" aria-hidden="true" />
                          ) : (
                            <span className="font-mono text-[10px] font-bold text-stone-600 shrink-0">
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
            data-no-translate="true"
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 border border-amber-700/25 rounded-xl text-[11px] sm:text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition-all shadow-[0_4px_16px_rgba(180,115,20,0.22)] cursor-pointer"
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
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 rounded-xl border border-[#D9BE91] bg-[#FFFDF8] text-amber-800 hover:bg-[#FAF0DE] transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF4E7] border-b-2 border-[#D4B075] px-4 py-4 space-y-4 max-h-[82vh] overflow-y-auto shadow-2xl">
          <nav aria-label="Mobile Navigation" data-no-translate="true" className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              const href = link.id === 'directory' ? '/' : `?view=${link.id}`;
              return (
                <a
                  key={link.id}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-extrabold border border-amber-700/30'
                      : 'bg-[#FFFDF8] text-stone-800 hover:bg-[#FAF0DE] hover:text-amber-900 border border-[#DFC7A0]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* High-Contrast Mobile Language Panel */}
          <div className="p-3 rounded-2xl bg-[#FFFDF9] text-stone-900 border-2 border-[#D4B075] shadow-md space-y-2.5">
            <div className="text-[11px] uppercase font-extrabold text-stone-900 flex items-center justify-between border-b border-[#E6D0AC] pb-2">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                <span>Select Language &amp; Country</span>
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F4E3C7] text-amber-900 font-bold">
                16 Languages
              </span>
            </div>
            <div data-no-translate="true" className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
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
                        ? 'bg-amber-400 text-stone-950 font-extrabold border-2 border-amber-700 shadow-xs'
                        : 'bg-white text-stone-900 font-semibold border border-[#E5D0AE] hover:bg-[#FAF0DE]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <CountryFlag lang={code} className="w-5 h-3.5" />
                      <span className="truncate">{meta.label}</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-stone-600 shrink-0">
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
