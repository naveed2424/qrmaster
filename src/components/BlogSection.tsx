import { useState, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
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
  Bookmark,
  Award,
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../types/qr';
import { BLOG_POSTS } from '../data/blogPosts';
import { BLOG_EDITORIAL_CATEGORIES, MASTER_PROMPT_REGISTRY } from '../data/blogMasterGuidelines';
import { QR_GENERATORS } from '../data/generators';
import AdSenseUnit from './AdSenseUnit';

interface BlogSectionProps {
  onSelectTool?: (toolId: string) => void;
  onNavigate?: (viewId: string) => void;
}

export default function BlogSection({ onSelectTool, onNavigate }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  // Filtered posts based on active category and search query
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.primaryKeyword && post.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Map category to color scheme
  const getCategoryBadgeClass = (category: BlogCategory) => {
    switch (category) {
      case 'Print Engineering & Standards':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'QR Business & Marketing':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'QR Tutorials & Guides':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Tech, Security & Privacy':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Industry Reviews & Exposes':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      case 'Conversions & Growth':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  // Resolve related tools for an article
  const getRelatedToolsData = (toolIds?: string[]) => {
    if (!toolIds || toolIds.length === 0) return [];
    return toolIds
      .map((id) => {
        if (id === 'converter') {
          return {
            id: 'converter',
            name: 'Metric Print Calculator',
            shortDescription: 'Calculate 10:1 distance rule, 300 DPI pixels, and mm/inch dimensions.',
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
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-yellow-300 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles ({BLOG_POSTS.length})</span>
          </button>

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline-block">
            Home &gt; Blog &gt; {selectedPost.category}
          </span>
        </div>

        <article className="bg-zinc-950/90 border border-amber-500/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xl">
          {/* Metadata Bar */}
          <div className="space-y-3 pb-6 border-b border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getCategoryBadgeClass(selectedPost.category)}`}>
                {selectedPost.category}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {selectedPost.date}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {selectedPost.readTime}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified ISO/IEC 18004
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              <span className="text-gold-gradient">{selectedPost.title}</span>
            </h1>

            {/* Author Credential Tagline */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black flex items-center justify-center text-xs shadow-md">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{selectedPost.author}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Author</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  {selectedPost.authorRole || 'Founder & Senior QR Systems Architect'}
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaways Box (GEO & Answer Engine Optimization) */}
          {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
            <div className="p-5 bg-amber-500/10 border-2 border-amber-500/35 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Executive Summary & Key Takeaways</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-200">
                {selectedPost.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {selectedPost.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-amber-400/80" />
                {tag}
              </span>
            ))}
          </div>

          {/* Main Article Content */}
          <div className="space-y-5 text-sm sm:text-base leading-relaxed text-zinc-300">
            {selectedPost.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-bold text-amber-300 pt-6 pb-1 border-b border-zinc-800">
                    {paragraph.replace('### ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h3 key={idx} className="text-base sm:text-lg font-bold text-white pt-4">
                    {paragraph.replace('#### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('| ')) {
                // Markdown table rendering
                const rows = paragraph.trim().split('\n').filter(r => !r.includes(':---'));
                return (
                  <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <tbody>
                        {rows.map((row, rIdx) => {
                          const cols = row.split('|').filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                          return (
                            <tr key={rIdx} className={rIdx === 0 ? 'border-b border-amber-500/30 text-amber-300 font-bold' : 'border-b border-zinc-800/60'}>
                              {cols.map((col, cIdx) => (
                                <td key={cIdx} className="p-2 whitespace-nowrap">{col.trim()}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (paragraph.startsWith('```')) {
                const codeContent = paragraph.replace(/```[a-z]*\n/, '').replace(/\n```/, '');
                return (
                  <pre key={idx} className="p-4 bg-black/90 border border-zinc-800 rounded-2xl font-mono text-xs text-amber-300 overflow-x-auto">
                    <code>{codeContent}</code>
                  </pre>
                );
              }
              return (
                <p key={idx} className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Compliant AdSense Placement (Post-Content) */}
          <AdSenseUnit slot="8358033803" />

          {/* Related In-Site Tools Callout Banner */}
          {relatedTools.length > 0 && (
            <div className="p-6 bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/35 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Wrench className="w-4 h-4" />
                <span>Featured Free Tools From This Article</span>
              </div>
              <p className="text-xs text-zinc-400">
                You can try every tool and calculation mentioned in this guide for 100% free with zero sign-up on QRForge Studio:
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
                    className="p-3.5 bg-zinc-900/90 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-400 rounded-xl text-left transition-all group cursor-pointer shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-300">
                      <span>{tool.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1">
                      {tool.shortDescription}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Structured FAQ Section */}
          {selectedPost.faqs && selectedPost.faqs.length > 0 && (
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Frequently Asked Questions</span>
              </div>
              <div className="space-y-2.5">
                {selectedPost.faqs.map((faq, fIdx) => {
                  const isOpen = expandedFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-zinc-800 bg-zinc-900/60 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isOpen ? null : fIdx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 bg-black/40">
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
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black font-black flex items-center justify-center text-lg shrink-0 shadow-lg">
              A
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <span>About the Author: {selectedPost.author}</span>
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Afzal is the lead systems architect of QRForge Studio. He specializes in ISO/IEC 18004 optical data encoding, commercial vector print workflows, and building open-source, client-side digital utility applications with zero subscription walls.
              </p>
            </div>
          </div>

          {/* Related Articles Footer */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Recommended Related Articles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.map((ra) => (
                  <button
                    key={ra.id}
                    onClick={() => {
                      setSelectedPost(ra);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] font-mono text-amber-400 mb-1">{ra.category} · {ra.readTime}</div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {ra.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer Action Bar */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedPost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              &larr; Return to All Articles
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer hover:scale-102"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </article>
      </div>
    );
  }

  // ALL ARTICLES CATALOG VIEW
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SEO Knowledge Platform & Editorial Hub</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          QR Engineering, Strategies & <span className="text-gold-gradient">Customization Playbooks</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Eight comprehensive, E-E-A-T verified master guides detailing physical print engineering, the 10:1 distance ratio, Reed-Solomon mathematics, and strategies to profit from QR codes without subscription traps.
        </p>

        {/* Master Prompt Guidelines Registry Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowGuidelinesModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md hover:border-amber-400"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>View Registered Master Prompt & Editorial Guidelines</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. 10:1 ratio, restaurant menu, vCard, scam expose)..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-hidden transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* 6 Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-amber-400 text-black shadow-md font-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
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
                    ? 'bg-amber-400 text-black shadow-md font-black'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1 text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid (8 Substantial Articles) */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-zinc-950/60 border border-zinc-800 rounded-3xl space-y-3">
          <BookOpen className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No articles match your criteria</h3>
          <p className="text-xs text-zinc-400">Try adjusting your search terms or category selection.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => {
                setSelectedPost(post);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-6 sm:p-8 bg-zinc-950/90 border border-zinc-800/80 hover:border-amber-500/50 rounded-3xl hover:shadow-[0_4px_30px_rgba(245,158,11,0.2)] transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-md"
            >
              <div className="space-y-4">
                {/* Category & Time */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadgeClass(post.category)}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Key Takeaways Highlight Box */}
                {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                  <div className="p-2.5 bg-black/40 border border-zinc-800/80 rounded-xl space-y-1 text-[11px] text-zinc-300">
                    <span className="font-bold text-amber-300 block">💡 Core Takeaway:</span>
                    <p className="line-clamp-2 text-zinc-300">{post.keyTakeaways[0]}</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-zinc-900 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                    A
                  </div>
                  <span>{post.author}</span>
                </div>
                <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read Guide</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Compliant AdSense Placement (Catalog Footer) */}
      <div className="pt-6">
        <AdSenseUnit slot="8358033803" />
      </div>

      {/* REGISTERED MASTER PROMPT & EDITORIAL GUIDELINES MODAL */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Permanent Master Editorial Framework</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Registered Master Prompt for All Blog Posts
                </h3>
              </div>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                <div className="font-bold text-amber-300 text-sm">
                  {MASTER_PROMPT_REGISTRY.title}
                </div>
                <p className="text-zinc-400">
                  Registered Version: <strong className="text-white">{MASTER_PROMPT_REGISTRY.version}</strong> · Topic: <strong className="text-white">{MASTER_PROMPT_REGISTRY.siteTopic}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>The Six Canonical Content Categories:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BLOG_EDITORIAL_CATEGORIES.map((cat, idx) => (
                    <div key={cat.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                      <div className="font-bold text-amber-300 text-xs">
                        {idx + 1}. {cat.name}
                      </div>
                      <p className="text-[11px] text-zinc-400">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>E-E-A-T & Google AdSense Compliance Standards:</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                  <li><strong>Experience:</strong> Every guide includes practical measurements, physical testing rules, and concrete real-world numbers.</li>
                  <li><strong>Expertise:</strong> All technical explanations adhere to ISO/IEC 18004 QR standards and Reed-Solomon algorithmic proofs.</li>
                  <li><strong>Authoritativeness:</strong> Deep topical authority with 60+ specialized generators directly linked from articles.</li>
                  <li><strong>Trust:</strong> Transparent author identity, zero sponsored spam, zero deceptive paywalls, 100% free lifetime access.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>GEO & Answer Engine Optimization Rules:</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                  {MASTER_PROMPT_REGISTRY.geoAeoRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-right">
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
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
