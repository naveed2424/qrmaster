import { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  Check,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  HelpCircle,
  Wrench,
  FileText,
  SlidersHorizontal,
  Award,
  ListChecks,
} from 'lucide-react';
import { BlogPost, BlogCategory, SupportedLanguage } from '../types/qr';
import { BLOG_POSTS } from '../data/blogPosts';
import { BLOG_EDITORIAL_CATEGORIES, MASTER_PROMPT_REGISTRY } from '../data/blogMasterGuidelines';
import { QR_GENERATORS } from '../data/generators';
import { LEGACY_POST_SLUG_MAP, resolveCanonicalPostSlug } from '../data/postSlugMap';
import { translateDocumentMeta } from '../utils/pageTranslator';
import AdSenseUnit from './AdSenseUnit';
import SubscribeAIInsightsCTA from './SubscribeAIInsightsCTA';
import fallbackPortrait from '../assets/images/founder_portrait_polished_1794521132031.jpg';

const FOUNDER_PORTRAIT = '/assets/aistudio/Portrait_professionnel_dans_un_bureau_moderne_7ddf5c42.png';

const HIGH_TRAFFIC_TOPIC_CHIPS = [
  'GS1 2027',
  'WhatsApp QR',
  'PDF QR',
  'Coupon QR',
  'GPS Maps',
  'Quishing Security',
  'Google Reviews',
  'Offline QR',
];

function parsePublishedIsoDate(dateStr?: string): string {
  if (!dateStr) return '2026-11-19';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return '2026-11-19';
  return parsed.toISOString().split('T')[0];
}

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

interface BlogSectionProps {
  currentLang?: SupportedLanguage;
  onSelectTool?: (toolId: string) => void;
  onNavigate?: (viewId: string) => void;
}

function findBlogPostByParam(postParam: string | null): BlogPost | null {
  if (!postParam) return null;
  const normalized = LEGACY_POST_SLUG_MAP[postParam.trim()] || postParam.trim();
  return BLOG_POSTS.find((p) => p.id === normalized || p.slug === normalized) || null;
}

export default function BlogSection({
  currentLang = 'en',
  onSelectTool,
  onNavigate,
}: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return findBlogPostByParam(params.get('post'));
  });
  const [missingPostParam, setMissingPostParam] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const postParam = params.get('post');
    if (!postParam) return null;
    return findBlogPostByParam(postParam) ? null : postParam;
  });
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Normalize legacy slugs or post-N IDs in the URL to their canonical slug
  useEffect(() => {
    if (typeof window === 'undefined' || !selectedPost) return;
    const params = new URLSearchParams(window.location.search);
    const postParam = params.get('post');
    const canonicalSlug = selectedPost.slug || selectedPost.id;
    if (postParam && postParam !== canonicalSlug) {
      window.history.replaceState(null, '', `?view=blog&post=${canonicalSlug}`);
    }
  }, [selectedPost]);

  // Sync browser back/forward navigation across individual posts
  useEffect(() => {
    const syncPostFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const postParam = params.get('post');
      if (!postParam) {
        setSelectedPost(null);
        setMissingPostParam(null);
      } else {
        const match = findBlogPostByParam(postParam);
        setSelectedPost(match);
        setMissingPostParam(match ? null : postParam);
      }
      const qParam = params.get('q');
      if (qParam !== null) {
        setSearchQuery(qParam);
      }
    };
    window.addEventListener('popstate', syncPostFromUrl);
    return () => window.removeEventListener('popstate', syncPostFromUrl);
  }, []);

  // Compute live word count & quick-jump Table of Contents for selected article
  const articleBlocks = useMemo(() => {
    if (!selectedPost) return [];
    return selectedPost.content.split('\n\n');
  }, [selectedPost]);

  const articleWordCount = useMemo(() => {
    if (!selectedPost) return 0;
    return selectedPost.content.trim().split(/\s+/).filter(Boolean).length;
  }, [selectedPost]);

  const tableOfContents = useMemo(() => {
    return articleBlocks
      .map((block, idx) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('### ')) {
          return { id: `sec-${idx}`, title: trimmed.replace('### ', '').trim() };
        }
        return null;
      })
      .filter((item): item is { id: string; title: string } => item !== null);
  }, [articleBlocks]);

  // Dynamic SEO Metadata, Canonical, OpenGraph, Twitter & Rich Schema.org JSON-LD (TechArticle + FAQPage + BreadcrumbList)
  useEffect(() => {
    const existingScript = document.getElementById('article-structured-data');
    if (selectedPost) {
      const slugOrId = selectedPost.slug || selectedPost.id;
      const canonicalUrl = `https://2qrcode.com/?view=blog&post=${slugOrId}`;
      const pageTitle = selectedPost.seoTitle || `${selectedPost.title} | 2qrcode.com`;
      const metaDesc = selectedPost.metaDescription || selectedPost.excerpt;
      const imageAbs = selectedPost.featuredImage
        ? `https://2qrcode.com${selectedPost.featuredImage}`
        : `https://2qrcode.com${FOUNDER_PORTRAIT}`;
      const isoDate = parsePublishedIsoDate(selectedPost.date);
      const keywordsList = [
        selectedPost.primaryKeyword,
        ...(selectedPost.secondaryKeywords || []),
        ...selectedPost.tags,
      ]
        .filter(Boolean)
        .join(', ');

      document.title = pageTitle;
      upsertMetaTag('name', 'robots', 'index, follow, max-image-preview:large');
      upsertMetaTag('name', 'description', metaDesc);
      void translateDocumentMeta(pageTitle, metaDesc, currentLang);
      if (keywordsList) upsertMetaTag('name', 'keywords', keywordsList);
      upsertMetaTag('name', 'author', selectedPost.author || 'Afzal Naveed');
      upsertMetaTag('property', 'og:type', 'article');
      upsertMetaTag('property', 'og:title', pageTitle);
      upsertMetaTag('property', 'og:description', metaDesc);
      upsertMetaTag('property', 'og:url', canonicalUrl);
      upsertMetaTag('property', 'og:image', imageAbs);
      upsertMetaTag('name', 'twitter:title', pageTitle);
      upsertMetaTag('name', 'twitter:description', metaDesc);
      upsertMetaTag('name', 'twitter:image', imageAbs);
      upsertCanonical(canonicalUrl);

      const graph: Record<string, unknown>[] = [
        {
          '@type': 'TechArticle',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
          headline: selectedPost.title,
          alternativeHeadline: selectedPost.seoTitle || selectedPost.title,
          description: metaDesc,
          image: [imageAbs],
          datePublished: isoDate,
          dateModified: '2026-11-27',
          wordCount: articleWordCount,
          keywords: keywordsList,
          articleSection: selectedPost.category,
          inLanguage: 'en',
          author: {
            '@type': 'Person',
            name: selectedPost.author || 'Afzal Naveed',
            jobTitle: selectedPost.authorRole || 'Founder & Senior QR Systems Architect',
            url: 'https://2qrcode.com/?view=about',
            image: `https://2qrcode.com${FOUNDER_PORTRAIT}`,
            knowsAbout: [
              'ISO/IEC 18004 QR Codes',
              'GS1 Digital Link 2D Barcodes',
              'Reed-Solomon Error Correction',
              'Technical SEO',
              'Cloud Security',
            ],
          },
          publisher: {
            '@type': 'Organization',
            name: '2qrcode.com',
            url: 'https://2qrcode.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://2qrcode.com/favicon.svg',
            },
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://2qrcode.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Editorial Blog',
              item: 'https://2qrcode.com/?view=blog',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: selectedPost.category,
              item: 'https://2qrcode.com/?view=blog',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: selectedPost.title,
              item: canonicalUrl,
            },
          ],
        },
      ];

      if (selectedPost.faqs && selectedPost.faqs.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          mainEntity: selectedPost.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }

      const script = existingScript || document.createElement('script');
      script.id = 'article-structured-data';
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph,
      });
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (missingPostParam) {
      if (existingScript) {
        existingScript.remove();
      }
      const notFoundTitle = 'Article Not Found (404) | 2qrcode.com';
      const notFoundDesc = 'The requested guide could not be found. Browse all 117 QR engineering guides on 2qrcode.com.';
      const selfUrl = `https://2qrcode.com/?view=blog&post=${encodeURIComponent(missingPostParam)}`;
      document.title = notFoundTitle;
      upsertMetaTag('name', 'robots', 'noindex, follow');
      upsertMetaTag('name', 'description', notFoundDesc);
      upsertMetaTag('property', 'og:type', 'website');
      upsertMetaTag('property', 'og:title', notFoundTitle);
      upsertMetaTag('property', 'og:description', notFoundDesc);
      upsertMetaTag('property', 'og:url', selfUrl);
      upsertCanonical(selfUrl);
    } else {
      if (existingScript) {
        existingScript.remove();
      }
      const catalogTitle = 'QR Engineering, AI & Customization Blog | 2qrcode.com';
      const catalogDesc = `${BLOG_POSTS.length} E-E-A-T verified guides on QR print engineering, GS1 Sunrise 2027, quishing security, offline Wi-Fi/vCard QR codes, and free static QR tools.`;
      document.title = catalogTitle;
      upsertMetaTag('name', 'robots', searchQuery.trim() ? 'noindex, follow' : 'index, follow, max-image-preview:large');
      upsertMetaTag('name', 'description', catalogDesc);
      void translateDocumentMeta(catalogTitle, catalogDesc, currentLang);
      upsertMetaTag('property', 'og:type', 'website');
      upsertMetaTag('property', 'og:title', catalogTitle);
      upsertMetaTag('property', 'og:description', catalogDesc);
      upsertMetaTag('property', 'og:url', 'https://2qrcode.com/?view=blog');
      upsertMetaTag('property', 'og:image', 'https://2qrcode.com/images/blog/post25-hero.svg');
      upsertCanonical('https://2qrcode.com/?view=blog');
    }

    return () => {
      const cleanupScript = document.getElementById('article-structured-data');
      if (cleanupScript) cleanupScript.remove();
    };
  }, [selectedPost, missingPostParam, searchQuery, articleWordCount, currentLang]);

  // Filtered posts based on active category and search query
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        (post.primaryKeyword && post.primaryKeyword.toLowerCase().includes(q)) ||
        (post.secondaryKeywords && post.secondaryKeywords.some((k) => k.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Map category to color scheme
  const getCategoryBadgeClass = (category: BlogCategory) => {
    switch (category) {
      case 'Print Engineering & Standards':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'QR Business & Marketing':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'QR Tutorials & Guides':
        return 'bg-amber-100 text-amber-900 border-amber-700/30';
      case 'Tech, Security & Privacy':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Industry Reviews & Exposes':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Conversions & Growth':
        return 'bg-yellow-100 text-amber-950 border-amber-500/40';
      default:
        return 'bg-[#FBF2E3] text-stone-800 border-[#DFC7A0]';
    }
  };

  // Resolve related tools for an article
  const toolAliasMap: Record<string, string> = {
    'google-review': 'reviews',
    calendar: 'event',
    barcode: 'sku',
    product: 'sku',
    location: 'geo',
  };

  const getRelatedToolsData = (toolIds?: string[]) => {
    if (!toolIds || toolIds.length === 0) return [];
    const seen = new Set<string>();
    return toolIds
      .map((rawId) => {
        const id = toolAliasMap[rawId] || rawId;
        if (seen.has(id)) return null;
        seen.add(id);
        if (id === 'converter') {
          return {
            id: 'converter',
            name: 'Metric Print Calculator',
            shortDescription: 'Calculate 10:1 distance rule, 300 DPI pixels, and mm/inch dimensions.',
            isView: true,
          };
        }
        if (id === 'batch') {
          return {
            id: 'batch',
            name: 'Batch CSV QR Generator',
            shortDescription: 'Upload a CSV spreadsheet and generate dozens or hundreds of styled QR codes at once.',
            isView: true,
          };
        }
        if (id === 'customizer') {
          return {
            id: 'customizer',
            name: 'QR Customizer Studio',
            shortDescription: 'Design custom dot shapes, gradients, centered logos, and CTA banners.',
            isView: true,
          };
        }
        const found = QR_GENERATORS.find((g) => g.id === id);
        if (found) {
          return {
            id: found.id,
            name: found.name,
            shortDescription: found.shortDescription,
            isView: false,
          };
        }
        return null;
      })
      .filter(Boolean) as { id: string; name: string; shortDescription: string; isView: boolean }[];
  };

  // Render inline markdown including tool/view links, internal post links, and external authoritative links
  const renderInlineContent = (text: string) => {
    const tokenRegex = /(\[[^\]]+\]\((?:(?:tool|view|post):[a-z0-9-]+|https?:\/\/[^\s)]+)\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/gi;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (!part) return null;

      const internalMatch = part.match(/^\[([^\]]+)\]\((tool|view|post):([a-z0-9-]+)\)$/i);
      if (internalMatch) {
        const [, label, targetType, rawTargetId] = internalMatch;
        const typeLower = targetType.toLowerCase();
        const resolvedId =
          typeLower === 'tool'
            ? toolAliasMap[rawTargetId] || rawTargetId
            : typeLower === 'post'
            ? resolveCanonicalPostSlug(rawTargetId)
            : rawTargetId;
        const targetPost =
          typeLower === 'post'
            ? BLOG_POSTS.find((p) => p.id === rawTargetId || p.id === resolvedId || p.slug === resolvedId)
            : null;
        const postHrefSlug = targetPost ? targetPost.slug || targetPost.id : resolvedId;
        const href =
          typeLower === 'view'
            ? `?view=${resolvedId}`
            : typeLower === 'post'
            ? `?view=blog&post=${postHrefSlug}`
            : `?tool=${resolvedId}`;
        return (
          <a
            key={i}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              if (typeLower === 'post') {
                if (targetPost) {
                  setSelectedPost(targetPost);
                  setMissingPostParam(null);
                  setExpandedFaqIndex(null);
                  window.history.pushState(null, '', `?view=blog&post=${targetPost.slug || targetPost.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              } else if (typeLower === 'view' && onNavigate) {
                onNavigate(resolvedId);
              } else if (onSelectTool) {
                onSelectTool(resolvedId);
              }
            }}
            className="text-amber-800 hover:text-amber-950 font-bold underline decoration-amber-700/60 underline-offset-4 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0" />
          </a>
        );
      }

      const externalMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/i);
      if (externalMatch) {
        const [, label, url] = externalMatch;
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-800 hover:text-sky-950 font-semibold underline decoration-sky-700/50 underline-offset-4 inline-flex items-center gap-1 transition-colors"
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0" />
          </a>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-stone-800">
            {part.slice(1, -1)}
          </em>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#FBF2E3] border border-[#E2CAA4] font-mono text-xs text-amber-900">
            {part.slice(1, -1)}
          </code>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  // MISSING ARTICLE (404) VIEW
  if (!selectedPost && missingPostParam) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <div className="bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-[0_14px_40px_-12px_rgba(120,82,25,0.16)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-xs font-extrabold uppercase tracking-wider">
            <span>404 · Article Not Found</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            We could not find that guide
          </h1>
          <p className="text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            The article slug <code className="px-1.5 py-0.5 rounded bg-[#FBF2E3] border border-[#E2CAA4] font-mono text-xs">{missingPostParam}</code> does not exist or may have moved. Browse all {BLOG_POSTS.length} published guides or return to the QR generator directory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setMissingPostParam(null);
                window.history.pushState(null, '', '?view=blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border border-amber-700/25 font-extrabold rounded-xl text-xs cursor-pointer shadow-sm"
            >
              Browse All {BLOG_POSTS.length} Guides
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('directory')}
              className="px-5 py-2.5 bg-[#FBF2E3] hover:bg-[#F4E3C8] text-stone-900 border border-[#DFC7A0] font-bold rounded-xl text-xs cursor-pointer"
            >
              Explore 72 Free QR Tools
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SINGLE ARTICLE READING VIEW
  if (selectedPost) {
    const relatedTools = getRelatedToolsData(selectedPost.relatedToolIds);
    const relatedArticles = BLOG_POSTS.filter(
      (p) => p.id !== selectedPost.id && (p.category === selectedPost.category || p.tags.some(t => selectedPost.tags.includes(t)))
    ).slice(0, 2);

    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedPost(null);
              window.history.pushState(null, '', '?view=blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles ({BLOG_POSTS.length})</span>
          </button>

          <span className="text-[11px] font-mono text-stone-600 hidden sm:inline-block">
            Home &gt; Blog &gt; {selectedPost.category}
          </span>
        </div>

        <article className="bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-3xl p-6 sm:p-10 shadow-[0_14px_40px_-12px_rgba(120,82,25,0.16)] space-y-8 backdrop-blur-xl">
          {/* Metadata Bar */}
          <div className="space-y-3 pb-6 border-b border-[#E6D0AC]">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getCategoryBadgeClass(selectedPost.category)}`}>
                {selectedPost.category}
              </span>
              <span className="text-stone-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                {selectedPost.date}
              </span>
              <span className="text-stone-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-700">
                <Clock className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                {selectedPost.readTime} ({articleWordCount.toLocaleString()} words)
              </span>
              <span className="text-stone-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-900 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                Fact-Checked &amp; ISO/IEC 18004 Verified · Updated Nov 19, 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              <span className="text-gold-gradient">{selectedPost.title}</span>
            </h1>

            {/* Author Credential Tagline */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate?.('about')}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
                aria-label={`View engineering profile for ${selectedPost.author}`}
              >
                <img
                  src={FOUNDER_PORTRAIT}
                  onError={(e) => {
                    e.currentTarget.src = fallbackPortrait;
                  }}
                  alt="Afzal Naveed — Founder & Senior QR Systems Architect"
                  width={40}
                  height={40}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover object-top border border-amber-700/50 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900 flex items-center gap-1.5 transition-colors">
                    <span>{selectedPost.author}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-700/25">Author</span>
                  </div>
                  <div className="text-[11px] text-stone-700">
                    {selectedPost.authorRole || 'Founder & Senior QR Systems Architect'} · View Credentials &rarr;
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Featured Editorial Image */}
          {selectedPost.featuredImage && (
            <figure className="rounded-2xl overflow-hidden border border-[#DFC7A0] bg-[#FBF2E3] shadow-md">
              <img
                src={selectedPost.featuredImage}
                alt={selectedPost.featuredImageAlt || selectedPost.title}
                width={1280}
                height={720}
                referrerPolicy="no-referrer"
                className={`w-full aspect-video ${
                  selectedPost.featuredImage.toLowerCase().endsWith('.svg')
                    ? 'object-contain bg-[#FBF2E3]'
                    : 'object-cover'
                }`}
              />
              {selectedPost.featuredImageAlt && (
                <figcaption className="px-4 py-2.5 text-xs text-stone-700 bg-[#FBF2E3] border-t border-[#E6D0AC]">
                  {selectedPost.featuredImageAlt}
                </figcaption>
              )}
            </figure>
          )}

          {/* Key Takeaways Box (GEO & Answer Engine Optimization) */}
          {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
            <div className="p-5 bg-amber-100/80 border-2 border-amber-700/25 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-800" aria-hidden="true" />
                <span>Executive Summary & Key Takeaways</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-800">
                {selectedPost.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#FFFDF9]/90 p-2.5 rounded-xl border border-[#DFC7A0]">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick-Jump Table of Contents ("In This Guide") */}
          {tableOfContents.length > 1 && (
            <nav
              aria-label="In This Guide"
              className="p-4 sm:p-5 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl space-y-2.5"
            >
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
                <ListChecks className="w-4 h-4 text-amber-800" aria-hidden="true" />
                <span>In This Guide ({tableOfContents.length} Sections)</span>
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {tableOfContents.map((section, sIdx) => (
                  <li key={section.id} className="flex items-start gap-2">
                    <span className="font-mono text-amber-800 font-bold shrink-0">
                      {String(sIdx + 1).padStart(2, '0')}.
                    </span>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(section.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="text-stone-800 hover:text-amber-900 font-semibold hover:underline transition-colors leading-snug"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {selectedPost.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#FBF2E3] text-stone-800 border border-[#E2CAA4] flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-amber-800" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>

          {/* Main Article Content */}
          <div className="space-y-5 text-sm sm:text-base leading-relaxed text-stone-700">
            {articleBlocks.map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed === '---') {
                return <hr key={idx} className="border-[#E6D0AC] my-6" />;
              }
              const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
              if (imgMatch) {
                const [, altText, imgSrc] = imgMatch;
                const isSvg = imgSrc.toLowerCase().endsWith('.svg');
                return (
                  <figure key={idx} className="my-6 rounded-2xl overflow-hidden border border-[#DFC7A0] bg-[#FBF2E3] shadow-md">
                    <img
                      src={imgSrc}
                      alt={altText}
                      width={1280}
                      height={720}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className={`w-full h-auto ${isSvg ? 'object-contain bg-[#FBF2E3]' : 'object-cover'}`}
                    />
                    {altText && (
                      <figcaption className="px-4 py-2.5 text-xs text-stone-700 bg-[#FBF2E3] border-t border-[#E6D0AC]">
                        {altText}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h2
                    key={idx}
                    id={`sec-${idx}`}
                    className="scroll-mt-24 text-xl sm:text-2xl font-bold text-amber-900 pt-6 pb-1 border-b border-[#E6D0AC]"
                  >
                    {trimmed.replace('### ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h3 key={idx} className="text-base sm:text-lg font-bold text-stone-900 pt-4">
                    {trimmed.replace('#### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={idx}
                    className="p-4 bg-[#FBF2E3] border-l-4 border-l-amber-700 border border-[#E2CAA4] rounded-2xl text-stone-800 italic text-sm leading-relaxed"
                  >
                    {renderInlineContent(trimmed.replace(/^>\s?/, ''))}
                  </blockquote>
                );
              }
              if (trimmed.startsWith('- ')) {
                const items = trimmed.split('\n- ');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 text-sm sm:text-base text-stone-700">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {renderInlineContent(item.replace(/^- /, ''))}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split(/\n(?=\d+\.\s)/);
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-stone-700">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {renderInlineContent(item.replace(/^\d+\.\s/, ''))}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (trimmed.startsWith('| ')) {
                const rows = trimmed.split('\n').filter(r => !r.includes(':---'));
                return (
                  <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-[#DFC7A0] bg-[#FBF2E3] p-2">
                    <table className="w-full text-left text-xs text-stone-700">
                      <tbody>
                        {rows.map((row, rIdx) => {
                          const cols = row.split('|').filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                          return (
                            <tr key={rIdx} className={rIdx === 0 ? 'border-b border-amber-700/30 text-amber-900 font-bold' : 'border-b border-[#E6D0AC]'}>
                              {cols.map((col, cIdx) => (
                                <td key={cIdx} className="p-2 whitespace-nowrap">{renderInlineContent(col.trim())}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (trimmed.startsWith('```')) {
                const codeContent = trimmed.replace(/```[a-z]*\n/, '').replace(/\n```/, '');
                return (
                  <pre key={idx} className="p-4 bg-[#291D0E] border border-amber-800/40 rounded-2xl font-mono text-xs text-amber-200 overflow-x-auto">
                    <code>{codeContent}</code>
                  </pre>
                );
              }
              return (
                <p key={idx} className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {renderInlineContent(trimmed)}
                </p>
              );
            })}
          </div>

          {/* Compliant AdSense Placement (Post-Content) */}
          <AdSenseUnit slot="8358033803" />

          {/* Related In-Site Tools Callout Banner */}
          {relatedTools.length > 0 && (
            <div className="p-6 bg-gradient-to-br from-amber-100/90 via-[#FFFDF9] to-[#FBF2E3] border border-[#DFC7A0] rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
                <Wrench className="w-4 h-4" />
                <span>Featured Free Tools From This Article</span>
              </div>
              <p className="text-xs text-stone-700">
                You can try every tool and calculation mentioned in this guide for 100% free with zero sign-up on 2qrcode.com:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (tool.isView && onNavigate) {
                        onNavigate(tool.id);
                      } else if (onSelectTool) {
                        onSelectTool(tool.id);
                      }
                    }}
                    className="p-3.5 bg-white hover:bg-[#FBF2E3] border border-[#DFC7A0] hover:border-amber-700/50 rounded-xl text-left transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-amber-900">
                      <span>{tool.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-800 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-1 mt-1">
                      {tool.shortDescription}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Structured FAQ Section */}
          {selectedPost.faqs && selectedPost.faqs.length > 0 && (
            <div className="pt-6 border-t border-[#E6D0AC] space-y-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
                <HelpCircle className="w-4 h-4 text-amber-800" />
                <span>Frequently Asked Questions</span>
              </div>
              <div className="space-y-2.5">
                {selectedPost.faqs.map((faq, fIdx) => {
                  const isOpen = expandedFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-[#E2CAA4] bg-[#FBF2E3] rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isOpen ? null : fIdx)}
                        aria-expanded={isOpen}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-stone-900 hover:text-amber-900 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-3 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-[#E6D0AC] bg-[#FFFDF9]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Author E-E-A-T Credibility Box */}
          <div className="p-5 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={FOUNDER_PORTRAIT}
              onError={(e) => {
                e.currentTarget.src = fallbackPortrait;
              }}
              alt="Afzal Naveed — Founder & Senior QR Systems Architect"
              width={64}
              height={64}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover object-top border border-amber-700/40 shrink-0 shadow-sm"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="text-xs font-bold text-stone-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>About the Author: {selectedPost.author}</span>
                <Award className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Afzal Naveed is the founder and lead systems architect of 2qrcode.com, specializing in HTML5, JavaScript, Java enterprise systems, Technical SEO, cloud security, and ISO/IEC 18004 QR workflows.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.('about')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline decoration-amber-700/50 underline-offset-4 cursor-pointer"
              >
                <span>View Engineering CV &amp; Editorial Credentials</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Related Articles Footer */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-[#E6D0AC] space-y-3">
              <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Recommended Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.map((ra) => (
                  <button
                    key={ra.id}
                    onClick={() => {
                      setSelectedPost(ra);
                      setExpandedFaqIndex(null);
                      window.history.pushState(null, '', `?view=blog&post=${ra.slug || ra.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-[#FBF2E3] hover:bg-[#F4E3C8] border border-[#E2CAA4] hover:border-amber-700/45 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] font-mono font-bold text-amber-800 mb-1">{ra.category} · {ra.readTime}</div>
                    <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2">
                      {ra.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer Action Bar */}
          <div className="pt-6 border-t border-[#E6D0AC] flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedPost(null);
                window.history.pushState(null, '', '?view=blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-stone-700 hover:text-amber-900 transition-colors cursor-pointer"
            >
              &larr; Return to All Articles
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border border-amber-700/25 font-extrabold rounded-xl text-xs transition-all shadow-[0_6px_16px_rgba(180,120,18,0.2)] cursor-pointer hover:scale-102"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </article>

        {/* Persistent AI Insights Newsletter CTA */}
        <SubscribeAIInsightsCTA compact />
      </div>
    );
  }

  // ALL ARTICLES CATALOG VIEW
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100/90 px-3 py-1 rounded-full border border-amber-700/25">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SEO Knowledge Platform & Editorial Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
          QR Engineering, Strategies & <span className="text-gold-gradient">Customization Playbooks</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto">
          {BLOG_POSTS.length} comprehensive, E-E-A-T verified master guides detailing physical print engineering, CSV batch automation, payment &amp; security QR workflows, and strategies to profit from QR codes without subscription traps.
        </p>

        {/* Master Prompt Guidelines Registry & Semantic Tool Finder Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowGuidelinesModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFDF9]/95 hover:bg-[#FBF2E3] border border-[#DFC7A0] hover:border-amber-700/50 text-amber-900 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
            <span>View Registered Master Prompt & Editorial Guidelines</span>
          </button>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('agent')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBF2E3] hover:bg-[#F4E3C8] border border-[#DFC7A0] hover:border-amber-700/50 text-stone-900 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
              <span>Open Semantic Tool &amp; Keyword Finder</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-800" aria-hidden="true" />
          <label htmlFor="blog-search-input" className="sr-only">Search editorial articles and guides</label>
          <input
            id="blog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. 10:1 ratio, restaurant menu, vCard, scam expose)..."
            className="w-full pl-10 pr-14 py-2.5 bg-white border border-[#D4B483] focus:border-amber-700 rounded-2xl text-xs text-stone-900 placeholder-stone-500 focus:outline-hidden transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-700 hover:text-stone-950 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* High-Traffic Organic Search Topic Quick-Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          <span className="text-xs font-bold text-stone-700 mr-1">Popular Topics:</span>
          {HIGH_TRAFFIC_TOPIC_CHIPS.map((topic) => {
            const isSelected = searchQuery.toLowerCase() === topic.toLowerCase();
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSearchQuery(isSelected ? '' : topic)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                    : 'bg-[#FBF2E3] text-stone-800 border-[#DFC7A0] hover:border-amber-700 hover:text-amber-950'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* 6 Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border border-amber-700/25 shadow-sm font-black'
                : 'bg-[#FFFDF9]/90 border border-[#DFC7A0] text-stone-800 hover:text-amber-900'
            }`}
          >
            All Articles ({BLOG_POSTS.length})
          </button>
          {BLOG_EDITORIAL_CATEGORIES.map((cat) => {
            const count = BLOG_POSTS.filter((p) => p.category === cat.name).length;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border border-amber-700/25 shadow-sm font-black'
                    : 'bg-[#FFFDF9]/90 border border-[#DFC7A0] text-stone-800 hover:text-amber-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1 text-[11px] font-semibold">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-3xl space-y-3">
          <BookOpen className="w-8 h-8 text-amber-800 mx-auto" aria-hidden="true" />
          <h2 className="text-sm font-bold text-stone-900">No articles match your criteria</h2>
          <p className="text-xs text-stone-700">Try adjusting your search terms or category selection.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredPosts.map((post) => {
            const postHref = `?view=blog&post=${post.slug || post.id}`;
            return (
              <article
                key={post.id}
                className="relative overflow-hidden bg-[#FFFDF9]/94 border border-[#DFC7A0] hover:border-amber-700/50 rounded-3xl shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)] hover:shadow-[0_16px_36px_-10px_rgba(180,120,18,0.22)] transition-all flex flex-col justify-between group backdrop-blur-md focus-within:ring-2 focus-within:ring-amber-700"
              >
                {post.featuredImage && (
                  <div className="w-full aspect-video overflow-hidden border-b border-[#E6D0AC] bg-[#FBF2E3]">
                    <img
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      width={1280}
                      height={720}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full ${
                        post.featuredImage.toLowerCase().endsWith('.svg')
                          ? 'object-contain bg-[#FBF2E3]'
                          : 'object-cover'
                      } group-hover:scale-[1.02] transition-transform duration-500`}
                    />
                  </div>
                )}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Category & Time */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryBadgeClass(post.category)}`}>
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono text-stone-700">
                        <span>{post.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                      <a
                        href={postHref}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedPost(post);
                          setExpandedFaqIndex(null);
                          window.history.pushState(null, '', postHref);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="focus:outline-none after:content-[''] after:absolute after:inset-0"
                      >
                        {post.title}
                      </a>
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Key Takeaways Highlight Box */}
                    {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                      <div className="p-2.5 bg-[#FBF2E3] border border-[#E2CAA4] rounded-xl space-y-1 text-xs text-stone-700">
                        <span className="font-bold text-amber-900 block">Core Takeaway:</span>
                        <p className="line-clamp-2 text-stone-700">{post.keyTakeaways[0]}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-[#E6D0AC] mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-stone-800 font-medium">
                      <img
                        src={FOUNDER_PORTRAIT}
                        onError={(e) => {
                          e.currentTarget.src = fallbackPortrait;
                        }}
                        alt={post.author}
                        width={28}
                        height={28}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover object-top border border-amber-700/40 shrink-0"
                      />
                      <span>{post.author}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Read Guide</span>
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Persistent AI Insights Newsletter CTA */}
      <div className="pt-2">
        <SubscribeAIInsightsCTA />
      </div>

      {/* Compliant AdSense Placement (Catalog Footer) */}
      <div className="pt-4">
        <AdSenseUnit slot="8358033803" />
      </div>

      {/* REGISTERED MASTER PROMPT & EDITORIAL GUIDELINES MODAL */}
      {showGuidelinesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guidelines-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md"
        >
          <div className="bg-[#FFFDF9] border border-[#DFC7A0] rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6D0AC]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>Permanent Master Editorial Framework</span>
                </div>
                <h2 id="guidelines-modal-title" className="text-xl font-extrabold text-stone-900">
                  Registered Master Prompt for All Blog Posts
                </h2>
              </div>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                aria-label="Close Guidelines Modal"
                className="p-2 rounded-xl bg-[#FBF2E3] text-stone-700 hover:text-stone-950 border border-[#E2CAA4] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-3.5 bg-amber-100/90 border border-amber-700/25 rounded-xl space-y-1">
                <div className="font-bold text-amber-900 text-sm">
                  {MASTER_PROMPT_REGISTRY.title}
                </div>
                <p className="text-stone-700">
                  Registered Version: <strong className="text-stone-900">{MASTER_PROMPT_REGISTRY.version}</strong> · Topic: <strong className="text-stone-900">{MASTER_PROMPT_REGISTRY.siteTopic}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-800" aria-hidden="true" />
                  <span>The Six Canonical Content Categories:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BLOG_EDITORIAL_CATEGORIES.map((cat, idx) => (
                    <div key={cat.id} className="p-3 bg-[#FBF2E3] rounded-xl border border-[#E2CAA4] space-y-1">
                      <div className="font-bold text-amber-900 text-xs">
                        {idx + 1}. {cat.name}
                      </div>
                      <p className="text-[11px] text-stone-700">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-800" aria-hidden="true" />
                  <span>E-E-A-T & Google AdSense Compliance Standards:</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-stone-700">
                  <li><strong>Experience:</strong> Every guide includes practical measurements, physical testing rules, and concrete real-world numbers.</li>
                  <li><strong>Expertise:</strong> All technical explanations adhere to ISO/IEC 18004 QR standards and Reed-Solomon algorithmic proofs.</li>
                  <li><strong>Authoritativeness:</strong> Deep topical authority with 70+ specialized generators directly linked from articles.</li>
                  <li><strong>Trust:</strong> Transparent author identity, zero sponsored spam, zero deceptive paywalls, 100% free lifetime access.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-800" aria-hidden="true" />
                  <span>GEO & Answer Engine Optimization Rules:</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-stone-700">
                  {MASTER_PROMPT_REGISTRY.geoAeoRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                <div className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">
                  Locked Permanent Daily &amp; Future Post Standard ({MASTER_PROMPT_REGISTRY.dailyTrendingSeoPrompt.minWords}+ Words)
                </div>
                <p className="text-stone-700">
                  <strong>Media Rule:</strong> {MASTER_PROMPT_REGISTRY.dailyTrendingSeoPrompt.requiredMedia}
                </p>
                <p className="text-stone-700">
                  <strong>Linking Rule:</strong> {MASTER_PROMPT_REGISTRY.dailyTrendingSeoPrompt.requiredLinks}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6D0AC] text-right">
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 border border-amber-700/25 font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Close Guidelines
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
