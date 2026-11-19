import { useState, useMemo, useId, useDeferredValue } from 'react';
import {
  Search,
  Star,
  ArrowRight,
  Sparkles,
  Shield,
  Download,
  Palette,
  Globe,
  Wifi,
  Contact,
  Utensils,
  Lock,
  Layers,
  Smartphone,
  Bookmark,
  Link as LinkIcon,
  FileText,
  Briefcase,
  Instagram,
  MessageSquare,
  Facebook,
  Youtube,
  Video,
  Twitter,
  Linkedin,
  Send,
  Users,
  Music,
  AtSign,
  Tag,
  Building,
  Barcode,
  Home,
  CalendarCheck,
  UserPlus,
  Mail,
  MessageCircle,
  PhoneCall,
  Phone,
  MessageSquareText,
  UserCheck,
  File,
  Music2,
  Film,
  Image,
  Tv,
  BookOpen,
  Calendar,
  Cast,
  MapPin,
  Plane,
  Key,
  Heart,
  ShieldCheck,
  AlignLeft,
  Copy,
  GitBranch,
  Terminal,
  Coins,
  CreditCard,
  Zap,
  DollarSign,
  QrCode,
  Banknote,
  TrendingUp,
} from 'lucide-react';
import { QRGeneratorTool, QRCategory, SupportedLanguage } from '../types/qr';
import { TRANSLATIONS } from '../data/translations';
import AdSenseUnit from './AdSenseUnit';

interface GeneratorsDirectoryProps {
  generators: QRGeneratorTool[];
  currentLang: SupportedLanguage;
  onSelectTool: (toolId: string, initialUrl?: string) => void;
}

// Helper to render authentic icon for each tool
function renderToolIcon(iconName: string, category: string) {
  const iconProps = {
    className: 'w-5 h-5 text-amber-800 group-hover:text-amber-950 transition-colors',
    'aria-hidden': true as const,
  };
  switch (iconName.toLowerCase()) {
    case 'wifi': return <Wifi {...iconProps} />;
    case 'globe': return <Globe {...iconProps} />;
    case 'layers': return <Layers {...iconProps} />;
    case 'layout': return <Layers {...iconProps} />;
    case 'smartphone': return <Smartphone {...iconProps} />;
    case 'bookmark': return <Bookmark {...iconProps} />;
    case 'link': return <LinkIcon {...iconProps} />;
    case 'filetext': return <FileText {...iconProps} />;
    case 'briefcase': return <Briefcase {...iconProps} />;
    case 'instagram': return <Instagram {...iconProps} />;
    case 'messagesquare': return <MessageSquare {...iconProps} />;
    case 'facebook': return <Facebook {...iconProps} />;
    case 'youtube': return <Youtube {...iconProps} />;
    case 'video': return <Video {...iconProps} />;
    case 'twitter': return <Twitter {...iconProps} />;
    case 'linkedin': return <Linkedin {...iconProps} />;
    case 'send': return <Send {...iconProps} />;
    case 'users': return <Users {...iconProps} />;
    case 'music': return <Music {...iconProps} />;
    case 'atsign': return <AtSign {...iconProps} />;
    case 'contact': return <Contact {...iconProps} />;
    case 'utensils': return <Utensils {...iconProps} />;
    case 'tag': return <Tag {...iconProps} />;
    case 'building': return <Building {...iconProps} />;
    case 'star': return <Star {...iconProps} />;
    case 'barcode': return <Barcode {...iconProps} />;
    case 'home': return <Home {...iconProps} />;
    case 'calendarcheck': return <CalendarCheck {...iconProps} />;
    case 'userplus': return <UserPlus {...iconProps} />;
    case 'mail': return <Mail {...iconProps} />;
    case 'messagecircle': return <MessageCircle {...iconProps} />;
    case 'phonecall': return <PhoneCall {...iconProps} />;
    case 'phone': return <Phone {...iconProps} />;
    case 'messagesquaretext': return <MessageSquareText {...iconProps} />;
    case 'usercheck': return <UserCheck {...iconProps} />;
    case 'file': return <File {...iconProps} />;
    case 'music2': return <Music2 {...iconProps} />;
    case 'film': return <Film {...iconProps} />;
    case 'image': return <Image {...iconProps} />;
    case 'tv': return <Tv {...iconProps} />;
    case 'bookopen': return <BookOpen {...iconProps} />;
    case 'calendar': return <Calendar {...iconProps} />;
    case 'cast': return <Cast {...iconProps} />;
    case 'mappin': return <MapPin {...iconProps} />;
    case 'plane': return <Plane {...iconProps} />;
    case 'key': return <Key {...iconProps} />;
    case 'heart': return <Heart {...iconProps} />;
    case 'shieldcheck': return <ShieldCheck {...iconProps} />;
    case 'alignleft': return <AlignLeft {...iconProps} />;
    case 'copy': return <Copy {...iconProps} />;
    case 'gitbranch': return <GitBranch {...iconProps} />;
    case 'terminal': return <Terminal {...iconProps} />;
    case 'lock': return <Lock {...iconProps} />;
    case 'coins': return <Coins {...iconProps} />;
    case 'creditcard': return <CreditCard {...iconProps} />;
    case 'zap': return <Zap {...iconProps} />;
    case 'dollarsign': return <DollarSign {...iconProps} />;
    case 'qrcode': return <QrCode {...iconProps} />;
    case 'banknote': return <Banknote {...iconProps} />;
    default:
      if (category === 'web') return <Globe {...iconProps} />;
      if (category === 'social') return <MessageSquare {...iconProps} />;
      if (category === 'finance') return <Coins {...iconProps} />;
      return <Sparkles {...iconProps} />;
  }
}

export default function GeneratorsDirectory({
  generators,
  currentLang,
  onSelectTool,
}: GeneratorsDirectoryProps) {
  const t = TRANSLATIONS[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QRCategory>('all');
  const [quickUrl, setQuickUrl] = useState('https://');

  // Deferred search input for fluid 60fps typing without rendering stutter
  const deferredSearch = useDeferredValue(searchQuery);

  const quickInputId = useId();
  const searchInputId = useId();

  const filteredGenerators = useMemo(() => {
    return generators.filter((gen) => {
      const matchesCategory = selectedCategory === 'all' || gen.category === selectedCategory;
      const q = deferredSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        gen.name.toLowerCase().includes(q) ||
        gen.shortDescription.toLowerCase().includes(q) ||
        gen.detailedDescription.toLowerCase().includes(q) ||
        gen.id.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [generators, selectedCategory, deferredSearch]);

  const categories: { id: QRCategory; label: string }[] = [
    { id: 'all', label: t.categories.all },
    { id: 'web', label: t.categories.web },
    { id: 'social', label: t.categories.social },
    { id: 'business', label: t.categories.business },
    { id: 'communication', label: t.categories.communication },
    { id: 'media', label: t.categories.media },
    { id: 'events', label: t.categories.events },
    { id: 'tech', label: t.categories.tech },
    { id: 'finance', label: t.categories.finance },
  ];

  const handleQuickCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = quickUrl.trim() === 'https://' || !quickUrl.trim() ? 'https://example.com' : quickUrl.trim();
    onSelectTool('url', finalUrl);
  };

  return (
    <div className="relative space-y-20 pb-16">
      {/* Hero Section with Moving Champagne QR Motifs */}
      <section className="relative pt-12 sm:pt-20 pb-12 text-center max-w-5xl mx-auto px-4 space-y-8 z-10">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-extrabold rounded-full bg-amber-100/90 text-amber-900 border border-amber-700/25 backdrop-blur-md shadow-[0_6px_18px_rgba(180,120,18,0.12)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
            <span>100% Free Forever · Zero Sign-Up · Client-Side Privacy Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 leading-[1.08]">
            Easily create a QR code for <br />
            <span className="text-gold-gradient drop-shadow-[0_2px_16px_rgba(180,120,18,0.16)]">
              any occasion in seconds!
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed">
            Choose from 70+ specialized generators: Wi-Fi, vCard business cards, social media, crypto payments, menus, and files. Add your logo, radiant golden colors, high-res frames, and download vector SVG/PNG without an account.
          </p>

          {/* Quick URL Input Bar */}
          <form
            onSubmit={handleQuickCreateSubmit}
            className="max-w-2xl mx-auto p-2 bg-[#FFFDF9]/95 rounded-2xl shadow-[0_14px_38px_-10px_rgba(120,82,25,0.2)] border border-[#DFC7A0] backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 px-3 w-full sm:flex-1">
              <Globe className="w-5 h-5 text-amber-800 shrink-0" aria-hidden="true" />
              <label htmlFor={quickInputId} className="sr-only">Enter or paste URL</label>
              <input
                id={quickInputId}
                type="text"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                placeholder="Enter or paste website URL..."
                className="w-full py-3 text-sm font-semibold bg-transparent text-stone-900 placeholder:text-stone-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 border border-amber-700/25 font-extrabold rounded-xl text-xs tracking-wider uppercase whitespace-nowrap transition-all shadow-[0_6px_18px_rgba(180,120,18,0.25)] hover:shadow-[0_8px_22px_rgba(180,120,18,0.35)] cursor-pointer"
            >
              Download QR Code &rarr;
            </button>
          </form>

          {/* Direct Batch CSV Shortcut */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
            <span className="text-stone-700 font-medium">Need dozens or hundreds of codes from a spreadsheet?</span>
            <button
              onClick={() => onSelectTool('batch')}
              className="px-4 py-2 rounded-xl bg-[#FFFDF9]/95 hover:bg-[#FBF2E3] border border-[#DFC7A0] hover:border-amber-700/45 text-amber-900 font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shadow-xs"
            >
              <span>Open Batch CSV QR Generator</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 70+ Generators Directory Header & Live Search */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <span className="text-gold-gradient">Or select another type of QR code</span>
            </h2>
            <p className="text-xs text-stone-700 mt-1">
              Choose from 70+ individual tools on 2qrcode.com tailored for Wi-Fi, contacts, apps, menus, and payments.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-800" aria-hidden="true" />
            <label htmlFor={searchInputId} className="sr-only">Search 70+ QR generators</label>
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 70+ generators (e.g., Wi-Fi, vCard)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-[#D4B483] bg-white text-stone-900 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border border-amber-700/25 shadow-[0_6px_16px_rgba(180,120,18,0.22)]'
                    : 'bg-[#FFFDF9]/90 border border-[#DFC7A0] text-stone-700 hover:text-amber-900 hover:border-amber-700/45'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Generator Cards Grid (Crawlable SEO Anchor Links) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGenerators.map((gen) => (
            <a
              key={gen.id}
              href={`?tool=${gen.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectTool(gen.id);
              }}
              aria-label={`${gen.name} — ${gen.shortDescription}`}
              className="p-5 text-left bg-[#FFFDF9]/92 border border-[#DFC7A0] hover:border-amber-700/50 rounded-2xl shadow-[0_8px_24px_-10px_rgba(120,82,25,0.12)] hover:shadow-[0_14px_30px_-8px_rgba(180,120,18,0.2)] transition-all group flex flex-col justify-between h-full cursor-pointer relative overflow-hidden backdrop-blur-xs focus-visible:outline-2 focus-visible:outline-amber-800"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FBF2E3] border border-[#E2CAA4] group-hover:border-amber-700/40 group-hover:bg-amber-100 flex items-center justify-center transition-colors shadow-xs">
                    {renderToolIcon(gen.iconName, gen.category)}
                  </div>
                  {gen.badge && (
                    <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide rounded-md bg-amber-100/90 text-amber-900 border border-amber-700/25">
                      {gen.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {gen.name}
                </h3>
                <p className="mt-1.5 text-xs text-stone-700 line-clamp-2 leading-relaxed">
                  {gen.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6D0AC] flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-1 text-amber-900 font-mono text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-700" aria-hidden="true" />
                  <span className="font-bold text-stone-900">{gen.rating.toFixed(1)}</span>
                  <span className="text-stone-700">({gen.ratingCount})</span>
                </div>
                <span className="text-xs font-bold text-amber-900 group-hover:text-amber-950 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Tool <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {filteredGenerators.length === 0 && (
          <div className="p-12 text-center bg-[#FFFDF9]/95 rounded-2xl border border-[#DFC7A0]">
            <p className="text-sm text-stone-700 font-medium">
              No QR generators matching "{searchQuery}" in this category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 border border-amber-700/25 rounded-lg text-xs font-bold cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* Well-spaced compliant AdSense placement separating tool directory and editorial guides */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <AdSenseUnit slot="8358033803" />
      </div>

      {/* "Create your QR code in three simple steps" */}
      <section className="border-y border-[#DFC7A0] bg-[#FBF4E8]/80 py-16 px-4 relative backdrop-blur-md">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
              Create your QR code in <span className="text-gold-gradient">three simple steps</span>
            </h2>
            <p className="text-sm text-stone-700 mt-2">
              From conception to high-resolution physical print in under 30 seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-7 bg-[#FFFDF9]/95 rounded-2xl border border-[#DFC7A0] hover:border-amber-700/45 shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)] space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-stone-950 border border-amber-700/25 font-extrabold text-lg flex items-center justify-center mx-auto shadow-[0_6px_18px_rgba(180,120,18,0.2)]">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Choose your QR code content
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Decide what you want to share. Select from URLs, Wi-Fi credentials, contact vCards, restaurant menus, videos, and crypto payments!
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-7 bg-[#FFFDF9]/95 rounded-2xl border border-[#DFC7A0] hover:border-amber-700/45 shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)] space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-stone-950 border border-amber-700/25 font-extrabold text-lg flex items-center justify-center mx-auto shadow-[0_6px_18px_rgba(180,120,18,0.2)]">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Customize your design
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Personalize your QR code colors, shape, and style to create a unique design. Add your brand logo in the center and choose a high-converting CTA frame.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-7 bg-[#FFFDF9]/95 rounded-2xl border border-[#DFC7A0] hover:border-amber-700/45 shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)] space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-stone-950 border border-amber-700/25 font-extrabold text-lg flex items-center justify-center mx-auto shadow-[0_6px_18px_rgba(180,120,18,0.2)]">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Download your QR code
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Save your QR code as high-resolution PNG, JPG, or scalable vector SVG. Print it or share it digitally anywhere with zero scan limits!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* "Experience the most advanced QR code generator" */}
      <section className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Experience the most <span className="text-gold-gradient">advanced QR code generator</span>
          </h2>
          <p className="text-xs text-stone-700 leading-relaxed">
            Our QR code software is highly functional and customizable, yet easy to use for all. It is the only tool you need to build powerful, high-performing QR codes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'High-tech QR codes',
              desc: 'Access advanced error correction, custom eye shapes, and center brand logos that scan effortlessly on any device.',
              icon: Sparkles,
            },
            {
              title: 'High conversion rates',
              desc: 'Create high-performing QR codes that accurately represent your brand and design, resulting in high scan rates.',
              icon: TrendingUp,
            },
            {
              title: 'Real-time analytics',
              desc: 'Boost your marketing campaigns with access to UTM tags that show when, where, and how many times your codes were scanned.',
              icon: Layers,
            },
            {
              title: 'Easy landing pages',
              desc: 'There is no need for you to build a website. Generate digital business cards, menus, and link trees in seconds.',
              icon: Globe,
            },
            {
              title: 'Multiple types of QR codes',
              desc: 'From Wi-Fi access and image galleries to vCards and cryptocurrency, you will find the right QR code for your needs.',
              icon: QrCode,
            },
            {
              title: 'Full customization',
              desc: 'Bring your QR codes to life with custom colors, dot shapes, and frames. Stand out from the competition.',
              icon: Palette,
            },
            {
              title: 'Easily download & print',
              desc: 'Keep highest resolution in PNG, vector SVG, and JPG at 300 DPI for commercial flyers, billboards, and packaging.',
              icon: Download,
            },
            {
              title: '100% Free Forever',
              desc: 'No credit card, no sign-up, and no subscription paywalls. Enjoy unlimited scans that never expire.',
              icon: Lock,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#FFFDF9]/92 border border-[#DFC7A0] hover:border-amber-700/45 rounded-2xl space-y-3 transition-all shadow-[0_8px_24px_-10px_rgba(120,82,25,0.12)]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-700/25 text-amber-800 flex items-center justify-center">
                <item.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">{item.title}</h3>
              <p className="text-xs text-stone-700 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
