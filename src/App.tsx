import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeneratorsDirectory from './components/GeneratorsDirectory';
import AnimatedQRBackground from './components/AnimatedQRBackground';
import CookieConsentBanner from './components/CookieConsentBanner';
import { QR_GENERATORS } from './data/generators';
import { getToolSeoGuide } from './data/toolSeoGuides';
import { resolveCanonicalPostSlug } from './data/postSlugMap';
import { QRCustomization, SupportedLanguage, QRGeneratorTool } from './types/qr';
import { GlobalDomTranslator, translateDocumentMeta } from './utils/pageTranslator';

const VALID_VIEWS = new Set([
  'directory',
  'customizer',
  'batch',
  'converter',
  'blog',
  'reviews',
  'about',
  'faqs',
  'privacy',
  'cookies',
  'terms',
  'contact',
  'video',
]);

const GeneratorToolPage = lazy(() => import('./components/GeneratorToolPage'));
const QRStudio = lazy(() => import('./components/QRStudio'));
const MetricConverter = lazy(() => import('./components/MetricConverter'));
const BlogSection = lazy(() => import('./components/BlogSection'));
const ReviewsSection = lazy(() => import('./components/ReviewsSection'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const UGCVideoView = lazy(() => import('./components/UGCVideoView'));
const BatchQRGenerator = lazy(() => import('./components/BatchQRGenerator'));
const LegalPages = lazy(() => import('./components/LegalPages'));

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('qr_language') as SupportedLanguage) || 'en';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    // Default to Silk Champagne mode; toggle switches softly between Silk Champagne and Pearl Champagne
    return localStorage.getItem('qr_champagne_tone') === 'pearl';
  });

  const [activeView, setActiveView] = useState<string>('directory');
  const [selectedToolId, setSelectedToolId] = useState<string>('url');
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  // Customization studio state tailored to high-contrast Champagne & Burnished Gold
  const [customization, setCustomization] = useState<QRCustomization>({
    fgColor: '#291D0E',
    bgColor: '#FFFDF8',
    useGradient: true,
    gradientColor2: '#92400E',
    gradientAngle: 45,
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
    eyeFrameColor: '#92400E',
    eyeBallColor: '#291D0E',
    errorCorrection: 'H',
    size: 1024,
    logoPreset: null,
    customLogoUrl: null,
    logoSizePercent: 22,
    frameType: 'bottom-bar',
    frameText: 'SCAN ME',
    frameColor: '#F59E0B',
    frameTextColor: '#1C1409',
  });

  // Sync subtle Champagne tone preference cleanly without black background
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('qr_champagne_tone', isDark ? 'pearl' : 'champagne');
  }, [isDark]);

  // Sync with browser URL / hash for direct shareable tool pages
  useEffect(() => {
    const syncFromUrl = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const explicitToolParam = params.get('tool');
      const hashToolCandidate = window.location.hash.replace(/^#/, '');
      const viewParam = params.get('view');
      const queryParam = params.get('q');

      if (pathname !== '/' && pathname !== '/index.html' && pathname !== '/video.html') {
        setIsNotFound(true);
        return;
      }

      if (pathname === '/video.html') {
        setIsNotFound(false);
        setActiveView('video');
        return;
      }

      if (viewParam) {
        const normalizedView = viewParam.toLowerCase();
        if (normalizedView === 'directory') {
          setIsNotFound(false);
          setActiveView('directory');
          window.history.replaceState(null, '', '/');
        } else if (VALID_VIEWS.has(normalizedView)) {
          setIsNotFound(false);
          setActiveView(normalizedView);
          if (viewParam !== normalizedView) {
            const nextParams = new URLSearchParams(window.location.search);
            nextParams.set('view', normalizedView);
            window.history.replaceState(null, '', `/?${nextParams.toString()}`);
          }
        } else {
          setIsNotFound(true);
        }
      } else if (explicitToolParam) {
        const match = QR_GENERATORS.find(
          (g) => g.id.toLowerCase() === explicitToolParam.toLowerCase()
        );
        if (match) {
          setIsNotFound(false);
          setSelectedToolId(match.id);
          setActiveView('tool');
          if (explicitToolParam !== match.id) {
            window.history.replaceState(null, '', `/?tool=${match.id}`);
          }
        } else {
          setIsNotFound(true);
        }
      } else if (hashToolCandidate) {
        const hashMatch = QR_GENERATORS.find(
          (g) => g.id.toLowerCase() === hashToolCandidate.toLowerCase()
        );
        if (hashMatch) {
          setIsNotFound(false);
          setSelectedToolId(hashMatch.id);
          setActiveView('tool');
        } else {
          setIsNotFound(false);
          setActiveView('directory');
        }
      } else if (queryParam) {
        setIsNotFound(false);
        setActiveView('blog');
      } else {
        setIsNotFound(false);
        setActiveView('directory');
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
    setIsNotFound(false);
    if (toolId === 'overview') {
      setActiveView('directory');
      window.history.pushState(null, '', '/');
    } else if (toolId === 'batch' || toolId === 'customizer' || toolId === 'converter') {
      setActiveView(toolId);
      window.history.pushState(null, '', `/?view=${toolId}`);
    } else {
      setSelectedToolId(toolId);
      setActiveView('tool');
      window.history.pushState(null, '', `/?tool=${toolId}`);
      if (initialUrl && toolId === 'url') {
        const urlTool = QR_GENERATORS.find((g) => g.id === 'url');
        if (urlTool) {
          urlTool.defaultValues.url = initialUrl;
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string, postId?: string) => {
    setIsNotFound(false);
    setActiveView(view);
    if (view === 'directory') {
      window.history.pushState(null, '', '/');
    } else if (postId) {
      window.history.pushState(null, '', `/?view=${view}&post=${resolveCanonicalPostSlug(postId)}`);
    } else {
      window.history.pushState(null, '', `/?view=${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTool: QRGeneratorTool =
    QR_GENERATORS.find((g) => g.id === selectedToolId) || QR_GENERATORS[0];

  const relatedTools = QR_GENERATORS.filter(
    (g) => g.category === currentTool.category && g.id !== currentTool.id
  );

  const translatorRef = useRef<GlobalDomTranslator | null>(null);

  useEffect(() => {
    const rootEl = document.getElementById('root') || document.body;
    const translator = new GlobalDomTranslator(rootEl);
    translatorRef.current = translator;
    translator.start(currentLang);
    return () => {
      translator.destroy();
      translatorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Sync document language attribute and RTL direction for Arabic
    document.documentElement.lang = currentLang;
    if (currentLang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    translatorRef.current?.setLanguage(currentLang);
  }, [currentLang]);

  useEffect(() => {
    if (currentLang === 'en') return;
    const timer = window.setTimeout(() => {
      translatorRef.current?.triggerResync();
    }, 90);
    return () => window.clearTimeout(timer);
  }, [activeView, selectedToolId, currentLang]);

  useEffect(() => {
    const robotsEl = document.querySelector('meta[name="robots"]');
    if (isNotFound) {
      const notFoundTitle = 'Page Not Found (404) | 2qrcode.com';
      const notFoundDesc = 'The requested page could not be found. Browse 72 free QR code generators and 97 guides on 2qrcode.com.';
      const selfUrl = `https://2qrcode.com${window.location.pathname}${window.location.search}`;
      document.title = notFoundTitle;
      if (robotsEl) robotsEl.setAttribute('content', 'noindex, follow');
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', notFoundDesc);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', selfUrl);
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) canonicalEl.setAttribute('href', selfUrl);
      return;
    }

    // BlogSection manages its own dynamic per-article SEO metadata when viewing a post
    const params = new URLSearchParams(window.location.search);
    if (activeView === 'blog' && params.get('post')) {
      return;
    }

    if (robotsEl) {
      const isSearch = activeView === 'blog' && Boolean(params.get('q'));
      robotsEl.setAttribute('content', isSearch ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    }

    const toolSeoGuide = getToolSeoGuide(currentTool.id);
    const viewMeta: Record<string, { title: string; description: string; canonical: string }> = {
      directory: {
        title: '2qrcode.com – 70+ Free QR Code Generators, Batch CSV & Customizer',
        description:
          'Generate 70+ types of permanent static QR codes and bulk CSV batches for free on 2qrcode.com with custom logos, colors, CTA frames, and 300 DPI SVG/PNG/JPG export.',
        canonical: 'https://2qrcode.com/',
      },
      tool: {
        title: toolSeoGuide?.seoTitle || `${currentTool.name} – Free QR Code Generator | 2qrcode.com`,
        description:
          toolSeoGuide?.metaDescription ||
          `${currentTool.shortDescription} Create a permanent, never-expiring ${currentTool.name} for free with vector SVG/PNG download and zero sign-up.`,
        canonical: `https://2qrcode.com/?tool=${currentTool.id}`,
      },
      customizer: {
        title: 'Full-Featured QR Customizer Studio | 2qrcode.com',
        description:
          'Customize QR code dot patterns, corner eyes, linear gradients, centered logos, and CTA frames with live scannability contrast checks.',
        canonical: 'https://2qrcode.com/?view=customizer',
      },
      batch: {
        title: 'Batch CSV QR Code Generator (Bulk ZIP Export) | 2qrcode.com',
        description:
          'Upload a CSV spreadsheet and generate dozens or hundreds of branded, static QR codes into one instant ZIP archive directly in your browser.',
        canonical: 'https://2qrcode.com/?view=batch',
      },
      converter: {
        title: 'QR Print Metric Converter (10:1 Rule & 300 DPI) | 2qrcode.com',
        description:
          'Calculate exact physical QR code dimensions in millimeters, inches, and 300 DPI pixels using the ISO/IEC 18004 10:1 scanning distance ratio.',
        canonical: 'https://2qrcode.com/?view=converter',
      },
      blog: {
        title: 'QR Engineering, AI & Customization Blog | 2qrcode.com',
        description:
          '97 E-E-A-T verified guides covering dedicated QR tools, GS1 Sunrise 2027 2D barcodes, quishing security, Google Review growth, offline QR codes, and print engineering.',
        canonical: 'https://2qrcode.com/?view=blog',
      },
      reviews: {
        title: 'Verified User Reviews & Trust Ratings | 2qrcode.com',
        description: 'Read verified reviews and real-world case ratings from businesses using 2qrcode.com free static QR tools.',
        canonical: 'https://2qrcode.com/?view=reviews',
      },
      about: {
        title: 'About 2qrcode.com & Founder Afzal Naveed',
        description:
          'Meet Afzal Naveed, Founder & Senior QR Systems Architect of 2qrcode.com—learn our zero-tracking, never-expiring QR engineering standards.',
        canonical: 'https://2qrcode.com/?view=about',
      },
      faqs: {
        title: 'Frequently Asked Questions (FAQs) | 2qrcode.com',
        description:
          'Answers on static vs dynamic QR expiration, Reed-Solomon Error Correction, SVG vs PNG print export, and commercial usage rights.',
        canonical: 'https://2qrcode.com/?view=faqs',
      },
      privacy: {
        title: 'Privacy Policy | 2qrcode.com',
        description: 'Read 2qrcode.com client-side privacy architecture and zero-storage QR code generation policy.',
        canonical: 'https://2qrcode.com/?view=privacy',
      },
      cookies: {
        title: 'Cookie & Advertising Policy | 2qrcode.com',
        description: 'Cookie preferences and transparent AdSense disclosure for 2qrcode.com.',
        canonical: 'https://2qrcode.com/?view=cookies',
      },
      terms: {
        title: 'Terms of Service & Disclaimer | 2qrcode.com',
        description: 'Terms of service and commercial usage license for 2qrcode.com QR code tools.',
        canonical: 'https://2qrcode.com/?view=terms',
      },
      contact: {
        title: 'Contact Us | 2qrcode.com',
        description: 'Contact founder Afzal Naveed and editorial support at 2qrcode.com.',
        canonical: 'https://2qrcode.com/?view=contact',
      },
      video: {
        title: 'TikTok & Reels Promo Video Studio | 2qrcode.com',
        description: 'Generate ready-to-share vertical QR promo videos for social media campaigns.',
        canonical: 'https://2qrcode.com/?view=video',
      },
    };

    const meta = viewMeta[activeView] || viewMeta.directory;
    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);

    void translateDocumentMeta(meta.title, meta.description, currentLang);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', meta.canonical);

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', meta.canonical);
  }, [isNotFound, activeView, currentTool.id, currentTool.name, currentTool.shortDescription, currentLang]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7E7CE] text-stone-900 relative selection:bg-amber-300/60 selection:text-stone-950">
      {/* Global Animated Champagne Background */}
      <AnimatedQRBackground tone={isDark ? 'pearl' : 'champagne'} />

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
        {isNotFound ? (
          <div className="max-w-3xl mx-auto py-16 px-4">
            <div className="bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-[0_14px_40px_-12px_rgba(120,82,25,0.16)]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-xs font-extrabold uppercase tracking-wider">
                <span>404 · Page Not Found</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                This QR page does not exist
              </h1>
              <p className="text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
                The requested URL could not be found on 2qrcode.com. Explore our 72 free static QR code generators, batch CSV studio, or 97 technical guides below.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('directory')}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border border-amber-700/25 font-extrabold rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Explore 72 Free QR Tools
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('blog')}
                  className="px-5 py-2.5 bg-[#FBF2E3] hover:bg-[#F4E3C8] text-stone-900 border border-[#DFC7A0] font-bold rounded-xl text-xs cursor-pointer"
                >
                  Read All 97 Guides
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeView === 'directory' && (
              <GeneratorsDirectory
                generators={QR_GENERATORS}
                currentLang={currentLang}
                onSelectTool={handleSelectTool}
              />
            )}

            <Suspense
          fallback={
            <div className="max-w-4xl mx-auto py-24 px-4 text-center text-sm text-stone-700 font-medium">
              Loading tool workspace...
            </div>
          }
        >
          {activeView === 'tool' && (
            <GeneratorToolPage
              tool={currentTool}
              currentLang={currentLang}
              customization={customization}
              onCustomizationChange={setCustomization}
              onSelectTool={handleSelectTool}
              onNavigate={handleNavigate}
              relatedTools={relatedTools}
            />
          )}

          {activeView === 'customizer' && (
            <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
                  Full-Featured QR Customizer Studio
                </h1>
                <p className="text-sm text-stone-700">
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
              currentLang={currentLang}
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
            </Suspense>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onSelectTool={handleSelectTool} />

      {/* GDPR / AdSense Cookie Consent Banner */}
      <CookieConsentBanner onNavigate={handleNavigate} />
    </div>
  );
}
