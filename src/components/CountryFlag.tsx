import { SupportedLanguage } from '../types/qr';

interface CountryFlagProps {
  lang: SupportedLanguage;
  className?: string;
}

export const LANGUAGE_META: Record<
  SupportedLanguage,
  { label: string; countryCode: string; countryName: string; emoji: string }
> = {
  en: { label: 'English', countryCode: 'US', countryName: 'United States', emoji: '🇺🇸' },
  es: { label: 'Español', countryCode: 'ES', countryName: 'Spain', emoji: '🇪🇸' },
  fr: { label: 'Français', countryCode: 'FR', countryName: 'France', emoji: '🇫🇷' },
  de: { label: 'Deutsch', countryCode: 'DE', countryName: 'Germany', emoji: '🇩🇪' },
  pt: { label: 'Português', countryCode: 'PT', countryName: 'Portugal', emoji: '🇵🇹' },
  it: { label: 'Italiano', countryCode: 'IT', countryName: 'Italy', emoji: '🇮🇹' },
  ja: { label: '日本語', countryCode: 'JP', countryName: 'Japan', emoji: '🇯🇵' },
  ar: { label: 'العربية', countryCode: 'SA', countryName: 'Saudi Arabia', emoji: '🇸🇦' },
  zh: { label: '简体中文', countryCode: 'CN', countryName: 'China', emoji: '🇨🇳' },
  hi: { label: 'हिन्दी', countryCode: 'IN', countryName: 'India', emoji: '🇮🇳' },
  ru: { label: 'Русский', countryCode: 'RU', countryName: 'Russia', emoji: '🇷🇺' },
  ko: { label: '한국어', countryCode: 'KR', countryName: 'South Korea', emoji: '🇰🇷' },
  tr: { label: 'Türkçe', countryCode: 'TR', countryName: 'Turkey', emoji: '🇹🇷' },
  id: { label: 'Bahasa Indo', countryCode: 'ID', countryName: 'Indonesia', emoji: '🇮🇩' },
  nl: { label: 'Nederlands', countryCode: 'NL', countryName: 'Netherlands', emoji: '🇳🇱' },
  pl: { label: 'Polski', countryCode: 'PL', countryName: 'Poland', emoji: '🇵🇱' },
};

export default function CountryFlag({ lang, className = 'w-6 h-4' }: CountryFlagProps) {
  const baseClass = `${className} rounded-[3px] shadow-xs border border-slate-300 shrink-0 overflow-hidden inline-block`;

  switch (lang) {
    case 'en': // US Flag
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="16" fill="#ffffff" />
          <rect y="0" width="24" height="2.3" fill="#b22234" />
          <rect y="4.6" width="24" height="2.3" fill="#b22234" />
          <rect y="9.2" width="24" height="2.3" fill="#b22234" />
          <rect y="13.7" width="24" height="2.3" fill="#b22234" />
          <rect width="11" height="9" fill="#3c3b6e" />
          <circle cx="2.5" cy="2.2" r="0.7" fill="#fff" />
          <circle cx="5.5" cy="2.2" r="0.7" fill="#fff" />
          <circle cx="8.5" cy="2.2" r="0.7" fill="#fff" />
          <circle cx="4" cy="4.5" r="0.7" fill="#fff" />
          <circle cx="7" cy="4.5" r="0.7" fill="#fff" />
          <circle cx="2.5" cy="6.8" r="0.7" fill="#fff" />
          <circle cx="5.5" cy="6.8" r="0.7" fill="#fff" />
          <circle cx="8.5" cy="6.8" r="0.7" fill="#fff" />
        </svg>
      );
    case 'es': // Spain
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="4" fill="#aa151b" />
          <rect y="4" width="24" height="8" fill="#f1bf00" />
          <rect y="12" width="24" height="4" fill="#aa151b" />
          <rect x="4.5" y="5.5" width="3" height="5" rx="0.8" fill="#aa151b" />
        </svg>
      );
    case 'fr': // France
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="8" height="16" fill="#002395" />
          <rect x="8" width="8" height="16" fill="#ffffff" />
          <rect x="16" width="8" height="16" fill="#ed2939" />
        </svg>
      );
    case 'de': // Germany
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="5.34" fill="#000000" />
          <rect y="5.33" width="24" height="5.34" fill="#dd0000" />
          <rect y="10.66" width="24" height="5.34" fill="#ffce00" />
        </svg>
      );
    case 'pt': // Portugal
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="9.6" height="16" fill="#006600" />
          <rect x="9.6" width="14.4" height="16" fill="#ff0000" />
          <circle cx="9.6" cy="8" r="3" fill="#ffcc00" />
        </svg>
      );
    case 'it': // Italy
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="8" height="16" fill="#009246" />
          <rect x="8" width="8" height="16" fill="#ffffff" />
          <rect x="16" width="8" height="16" fill="#ce2b37" />
        </svg>
      );
    case 'ja': // Japan
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="16" fill="#ffffff" />
          <circle cx="12" cy="8" r="4.5" fill="#bc002d" />
        </svg>
      );
    case 'ar': // Saudi Arabia
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="16" fill="#006c35" />
          <rect x="5" y="5.5" width="14" height="2" rx="1" fill="#ffffff" />
          <rect x="6" y="10" width="12" height="1.3" rx="0.6" fill="#ffffff" />
        </svg>
      );
    case 'zh': // China
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="16" fill="#de2910" />
          <circle cx="5.2" cy="4.8" r="2.1" fill="#ffde00" />
          <circle cx="9.2" cy="2.5" r="0.7" fill="#ffde00" />
          <circle cx="10.4" cy="4.4" r="0.7" fill="#ffde00" />
          <circle cx="10.2" cy="6.6" r="0.7" fill="#ffde00" />
          <circle cx="8.8" cy="8.2" r="0.7" fill="#ffde00" />
        </svg>
      );
    case 'hi': // India
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="5.34" fill="#ff9933" />
          <rect y="5.33" width="24" height="5.34" fill="#ffffff" />
          <rect y="10.66" width="24" height="5.34" fill="#138808" />
          <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="1" />
        </svg>
      );
    case 'ru': // Russia
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="5.34" fill="#ffffff" />
          <rect y="5.33" width="24" height="5.34" fill="#0039a6" />
          <rect y="10.66" width="24" height="5.34" fill="#d52b1e" />
        </svg>
      );
    case 'ko': // South Korea
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="16" fill="#ffffff" />
          <path d="M12 4.2 A3.8 3.8 0 0 1 12 11.8 A1.9 1.9 0 0 1 12 8 A1.9 1.9 0 0 0 12 4.2Z" fill="#cd2e3a" />
          <path d="M12 11.8 A3.8 3.8 0 0 1 12 4.2 A1.9 1.9 0 0 0 12 8 A1.9 1.9 0 0 1 12 11.8Z" fill="#0047a0" />
          <rect x="3.5" y="2.5" width="3" height="1.2" transform="rotate(-32 5 3.1)" fill="#111" />
          <rect x="17.5" y="2.5" width="3" height="1.2" transform="rotate(32 19 3.1)" fill="#111" />
          <rect x="3.5" y="12" width="3" height="1.2" transform="rotate(32 5 12.6)" fill="#111" />
          <rect x="17.5" y="12" width="3" height="1.2" transform="rotate(-32 19 12.6)" fill="#111" />
        </svg>
      );
    case 'tr': // Turkey
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="16" fill="#e30a17" />
          <circle cx="9.2" cy="8" r="3.6" fill="#ffffff" />
          <circle cx="10.4" cy="8" r="2.9" fill="#e30a17" />
          <circle cx="13.8" cy="8" r="1.2" fill="#ffffff" />
        </svg>
      );
    case 'id': // Indonesia
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="8" fill="#ff0000" />
          <rect y="8" width="24" height="8" fill="#ffffff" />
        </svg>
      );
    case 'nl': // Netherlands
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="5.34" fill="#ae1c28" />
          <rect y="5.33" width="24" height="5.34" fill="#ffffff" />
          <rect y="10.66" width="24" height="5.34" fill="#21468b" />
        </svg>
      );
    case 'pl': // Poland
      return (
        <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
          <rect width="24" height="8" fill="#ffffff" />
          <rect y="8" width="24" height="8" fill="#dc143c" />
        </svg>
      );
  }
}
