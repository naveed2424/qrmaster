import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeneratorsDirectory from './components/GeneratorsDirectory';
import GeneratorToolPage from './components/GeneratorToolPage';
import QRStudio from './components/QRStudio';
import MetricConverter from './components/MetricConverter';
import BlogSection from './components/BlogSection';
import ReviewsSection from './components/ReviewsSection';
import AboutUs from './components/AboutUs';
import FAQSection from './components/FAQSection';
import AnimatedQRBackground from './components/AnimatedQRBackground';
import UGCVideoView from './components/UGCVideoView';
import BatchQRGenerator from './components/BatchQRGenerator';
import LegalPages from './components/LegalPages';
import CookieConsentBanner from './components/CookieConsentBanner';
import { QR_GENERATORS } from './data/generators';
import { QRCustomization, SupportedLanguage, QRGeneratorTool } from './types/qr';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('qr_language') as SupportedLanguage) || 'en';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('qr_theme');
    if (saved) return saved === 'dark';
    return true; // Default to luxury Obsidian Black & Radiant Gold theme
  });

  const [activeView, setActiveView] = useState<string>('directory');
  const [selectedToolId, setSelectedToolId] = useState<string>('url');

  // Customization studio state with brilliant metallic gold on obsidian black
  const [customization, setCustomization] = useState<QRCustomization>({
    fgColor: '#facc15',
    bgColor: '#000000',
    useGradient: true,
    gradientColor2: '#ca8a04',
    gradientAngle: 45,
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
    eyeFrameColor: '#facc15',
    eyeBallColor: '#facc15',
    errorCorrection: 'H',
    size: 1024,
    logoPreset: null,
    customLogoUrl: null,
    logoSizePercent: 22,
    frameType: 'bottom-bar',
    frameText: 'SCAN ME',
    frameColor: '#facc15',
    frameTextColor: '#000000',
  });

  // Dark mode effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('qr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('qr_theme', 'light');
    }
  }, [isDark]);

  // Sync with browser URL / hash for direct shareable tool pages
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool') || window.location.hash.replace(/^#/, '');
      const viewParam = params.get('view');

      if (viewParam) {
        setActiveView(viewParam);
      } else if (toolParam) {
        const match = QR_GENERATORS.find(
          (g) => g.id.toLowerCase() === toolParam.toLowerCase()
        );
        if (match) {
          setSelectedToolId(match.id);
          setActiveView('tool');
        }
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    localStorage.setItem('qr_language', lang);
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSelectTool = (toolId: string, initialUrl?: string) => {
    if (toolId === 'overview') {
      setActiveView('directory');
      window.history.pushState(null, '', window.location.pathname);
    } else if (toolId === 'batch' || toolId === 'customizer' || toolId === 'converter') {
      setActiveView(toolId);
      window.history.pushState(null, '', `?view=${toolId}`);
    } else {
      setSelectedToolId(toolId);
      setActiveView('tool');
      window.history.pushState(null, '', `?tool=${toolId}`);
      if (initialUrl && toolId === 'url') {
        const urlTool = QR_GENERATORS.find((g) => g.id === 'url');
        if (urlTool) {
          urlTool.defaultValues.url = initialUrl;
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    if (view === 'directory') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.history.pushState(null, '', `?view=${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTool: QRGeneratorTool =
    QR_GENERATORS.find((g) => g.id === selectedToolId) || QR_GENERATORS[0];

  const relatedTools = QR_GENERATORS.filter(
    (g) => g.category === currentTool.category && g.id !== currentTool.id
  );

  useEffect(() => {
    // Sync document language attribute and RTL direction for Arabic
    document.documentElement.lang = currentLang;
    if (currentLang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [currentLang]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070709] text-zinc-100 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Global Animated Moving QR Codes in the Background */}
      <AnimatedQRBackground />

      {/* 3-Zone Top Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onNavigate={handleNavigate}
        onQuickCreate={() => handleSelectTool('url')}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        {activeView === 'directory' && (
          <GeneratorsDirectory
            generators={QR_GENERATORS}
            currentLang={currentLang}
            onSelectTool={handleSelectTool}
          />
        )}

        {activeView === 'tool' && (
          <GeneratorToolPage
            tool={currentTool}
            currentLang={currentLang}
            customization={customization}
            onCustomizationChange={setCustomization}
            onSelectTool={handleSelectTool}
            relatedTools={relatedTools}
          />
        )}

        {activeView === 'customizer' && (
          <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Full-Featured QR Customizer Studio
              </h1>
              <p className="text-sm text-zinc-400">
                Design custom patterns, linear gradients, add centered brand logos, and apply high-converting Call To Action frames.
              </p>
            </div>
            <QRStudio
              payload="https://2qrcode.com"
              toolName="Branded QR"
              currentLang={currentLang}
              customization={customization}
              onCustomizationChange={setCustomization}
            />
          </div>
        )}

        {activeView === 'batch' && (
          <BatchQRGenerator
            currentLang={currentLang}
            customization={customization}
            onCustomizationChange={setCustomization}
          />
        )}

        {activeView === 'converter' && (
          <MetricConverter currentLang={currentLang} />
        )}

        {activeView === 'blog' && (
          <BlogSection
            onSelectTool={handleSelectTool}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'reviews' && (
          <ReviewsSection />
        )}

        {activeView === 'about' && (
          <AboutUs />
        )}

        {activeView === 'faqs' && (
          <FAQSection />
        )}

        {(activeView === 'privacy' || activeView === 'cookies' || activeView === 'terms' || activeView === 'contact') && (
          <LegalPages page={activeView} onNavigate={handleNavigate} />
        )}

        {activeView === 'video' && (
          <UGCVideoView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onSelectTool={handleSelectTool} />

      {/* GDPR / AdSense Cookie Consent Banner */}
      <CookieConsentBanner onNavigate={handleNavigate} />
    </div>
  );
}
