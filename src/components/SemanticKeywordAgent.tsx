import { useState, useMemo, useId } from 'react';
import {
  Search,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Compass,
  SlidersHorizontal,
} from 'lucide-react';
import {
  SEMANTIC_KEYWORD_CLUSTERS,
  SearchIntentType,
  SemanticKeywordCluster,
} from '../data/semanticKeywordIndex';
import { resolveCanonicalPostSlug } from '../data/postSlugMap';
import {
  runSemanticToolDiscovery,
  buildAnswerEngineSnippet,
} from '../utils/semanticToolAgent';
import AdSenseUnit from './AdSenseUnit';

interface SemanticKeywordAgentProps {
  onSelectTool: (toolId: string) => void;
  onNavigate: (view: string, postId?: string) => void;
}

const EXAMPLE_PROBLEMS = [
  'let cafe and airbnb guests join wifi without typing passwords',
  'print 500 warehouse shelf labels from excel spreadsheet into zip',
  'collect more 5 star google reviews at salon and restaurant checkout',
  'fix blurry 203 dpi thermal receipt and shipping label barcode qr',
  'hipaa friendly dental clinic patient intake form without third party tracking',
  'create short vertical reels and tiktok qr promo video',
  'free church charity gala donation qr without platform fees',
  'trade show exhibitor lead capture qr without renting scanner',
];

const INTENT_LABELS: { id: 'all' | SearchIntentType; label: string }[] = [
  { id: 'all', label: 'All Search Intents' },
  { id: 'how-to', label: 'How-To Workflows' },
  { id: 'commercial', label: 'Commercial & Zero-Fee' },
  { id: 'troubleshooting', label: 'Print & Scan Fixes' },
  { id: 'privacy-offline', label: 'Privacy & Offline' },
  { id: 'llm-prompt', label: 'AI & LLM Comparisons' },
];

export default function SemanticKeywordAgent({
  onSelectTool,
  onNavigate,
}: SemanticKeywordAgentProps) {
  const [activeTab, setActiveTab] = useState<'finder' | 'explorer'>('finder');
  const [queryInput, setQueryInput] = useState<string>(
    'let cafe and airbnb guests join wifi without typing passwords'
  );
  const [intentFilter, setIntentFilter] = useState<'all' | SearchIntentType>('all');
  const [keywordFilter, setKeywordFilter] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const finderInputId = useId();
  const explorerInputId = useId();

  const discovery = useMemo(
    () => runSemanticToolDiscovery(queryInput, 6),
    [queryInput]
  );

  const filteredClusters = useMemo(() => {
    const q = keywordFilter.trim().toLowerCase();
    return SEMANTIC_KEYWORD_CLUSTERS.filter((cluster) => {
      if (intentFilter !== 'all' && cluster.intent !== intentFilter) return false;
      if (!q) return true;
      return (
        cluster.query.toLowerCase().includes(q) ||
        cluster.targetLabel.toLowerCase().includes(q) ||
        cluster.answerHook.toLowerCase().includes(q) ||
        cluster.relatedLongTails.some((lt) => lt.toLowerCase().includes(q))
      );
    });
  }, [intentFilter, keywordFilter]);

  const handleOpenTarget = (targetType: 'tool' | 'view', targetId: string) => {
    if (targetType === 'view') {
      onNavigate(targetId);
    } else {
      onSelectTool(targetId);
    }
  };

  const handleCopySnippet = async (cluster: SemanticKeywordCluster) => {
    const snippet = buildAnswerEngineSnippet(cluster);
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedId(cluster.id);
      window.setTimeout(() => setCopiedId(null), 2200);
    } catch {
      // Clipboard blocked in restricted frame
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold text-amber-800 tracking-wide">
          Semantic Tool Router · Long-Tail Search &amp; Answer Engine Directory
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
          Find the exact QR tool for any search intent
        </h1>
        <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
          Describe a real-world business problem, troubleshooting symptom, or search phrase in plain language. This semantic agent maps natural queries across 72 specialized static QR generators, 4 studio workspaces, and 117 technical guides—and exports clean FAQ Schema snippets for search and AI crawlers.
        </p>

        {/* Functional Tab Switcher */}
        <div className="pt-2 inline-flex flex-wrap items-center gap-1 p-1 bg-[#EFE0C4]/80 border border-[#D4B483] rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('finder')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'finder'
                ? 'bg-[#FFFDF9] text-stone-950 shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
            <span>Semantic Tool Finder</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'explorer'
                ? 'bg-[#FFFDF9] text-stone-950 shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
            <span>Long-Tail Query &amp; Schema Explorer</span>
          </button>
        </div>
      </header>

      {/* TAB 1: SEMANTIC TOOL & INTENT MATCHMAKER */}
      {activeTab === 'finder' && (
        <section className="space-y-8" aria-label="Semantic Tool Finder">
          <div className="bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-2xl p-5 sm:p-7 space-y-5 shadow-[0_10px_28px_-10px_rgba(120,82,25,0.12)]">
            <div className="space-y-2">
              <label
                htmlFor={finderInputId}
                className="block text-xs font-bold text-stone-800"
              >
                Enter any user question, industry problem, or long-tail search query
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    className="w-4 h-4 text-amber-800 absolute left-3.5 top-3.5"
                    aria-hidden="true"
                  />
                  <input
                    id={finderInputId}
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="e.g., thermal shipping label barcode blurry 203 dpi, or clinic patient intake form without tracking..."
                    className="w-full pl-10 pr-4 py-3 text-sm font-medium rounded-xl border border-[#D4B483] bg-white text-stone-900 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                  />
                </div>
                {queryInput && (
                  <button
                    type="button"
                    onClick={() => setQueryInput('')}
                    className="px-4 py-2.5 text-xs font-bold text-stone-800 bg-[#FBF2E3] hover:bg-[#F3E2C6] border border-[#DFC7A0] rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    Clear Query
                  </button>
                )}
              </div>
            </div>

            {/* Real Interactive Preset Queries */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-stone-600">
                Try live high-intent search queries:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROBLEMS.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setQueryInput(sample)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors text-left cursor-pointer ${
                      queryInput.toLowerCase() === sample.toLowerCase()
                        ? 'bg-amber-100 border-amber-700/45 text-stone-950 font-bold'
                        : 'bg-[#FBF4E7]/80 border-[#E2CAA4] text-stone-700 hover:text-stone-950 hover:border-amber-700/40'
                    }`}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ranked Results */}
          {discovery.matches.length > 0 ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#DFC7A0] pb-3">
                <h2 className="text-xl font-extrabold text-stone-900">
                  Proposed Tools &amp; Canonical Routes ({discovery.matches.length})
                </h2>
                <p className="text-xs text-stone-600 font-mono tabular-nums">
                  Matched tokens: {discovery.normalizedTerms.slice(0, 6).join(', ')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {discovery.matches.map((match, idx) => {
                  const targetHref =
                    match.targetType === 'view'
                      ? `?view=${match.id}`
                      : `?tool=${match.id}`;
                  return (
                    <article
                      key={`${match.targetType}:${match.id}`}
                      className="bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-[0_8px_24px_-10px_rgba(120,82,25,0.12)]"
                    >
                      <div className="space-y-3">
                        <div className="text-xs text-stone-600 flex flex-wrap items-center gap-2">
                          <span className="font-bold text-amber-900">
                            0{idx + 1}. {match.targetType === 'view' ? 'Studio Workspace' : 'Generator Tool'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{match.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[11px]">{match.canonicalUrl.replace('https://', '')}</span>
                        </div>

                        <h3 className="text-lg font-extrabold text-stone-900">
                          {match.name}
                        </h3>

                        <p className="text-sm text-stone-700 leading-relaxed">
                          {match.whyProposed}
                        </p>

                        {match.longTailQueries.length > 0 && (
                          <div className="pt-2 border-t border-[#E6D0AC] space-y-1.5">
                            <p className="text-xs font-bold text-stone-800">
                              Long-tail queries routing here
                            </p>
                            <ul className="space-y-1 text-xs text-stone-700 list-disc pl-4">
                              {match.longTailQueries.slice(0, 3).map((lt) => (
                                <li key={lt}>{lt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {match.recommendedGuides.length > 0 && (
                          <div className="pt-2 border-t border-[#E6D0AC] space-y-1.5">
                            <p className="text-xs font-bold text-stone-800">
                              Matching SEO &amp; E-E-A-T Guides
                            </p>
                            <div className="space-y-1">
                              {match.recommendedGuides.map((g) => (
                                <a
                                  key={g.id}
                                  href={`?view=blog&post=${g.slug}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate('blog', g.id);
                                  }}
                                  className="block text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2 truncate"
                                >
                                  <BookOpen className="w-3 h-3 inline mr-1.5" aria-hidden="true" />
                                  {g.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#E6D0AC] flex items-center justify-between gap-3">
                        <a
                          href={targetHref}
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenTarget(match.targetType, match.id);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 border border-amber-700/25 font-extrabold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <span>Launch {match.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-10 bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-2xl text-center space-y-3">
              <Sparkles className="w-5 h-5 text-amber-800 mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-stone-800">
                Type a scenario above—or choose one of the popular real-world prompts—to match tools automatically.
              </p>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: LONG-TAIL KEYWORD & SCHEMA EXPLORER */}
      {activeTab === 'explorer' && (
        <section className="space-y-6" aria-label="Long-Tail Query Explorer">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {INTENT_LABELS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setIntentFilter(tab.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    intentFilter === tab.id
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 border border-amber-700/25'
                      : 'bg-[#FFFDF9] border border-[#DFC7A0] text-stone-700 hover:text-stone-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-amber-800 absolute left-3 top-2.5" aria-hidden="true" />
              <label htmlFor={explorerInputId} className="sr-only">
                Filter long-tail queries
              </label>
              <input
                id={explorerInputId}
                type="text"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                placeholder="Filter keyword clusters..."
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#D4B483] bg-white text-stone-900 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-700"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredClusters.map((cluster) => {
              const targetHref =
                cluster.targetType === 'view'
                  ? `?view=${cluster.targetId}`
                  : `?tool=${cluster.targetId}`;
              const guideSlug = resolveCanonicalPostSlug(cluster.recommendedPostId);

              return (
                <article
                  key={cluster.id}
                  className="bg-[#FFFDF9]/95 border border-[#DFC7A0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-amber-900 capitalize">
                        {cluster.intent.replace('-', ' ')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{cluster.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Proposed route: {cluster.targetLabel}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopySnippet(cluster)}
                      className="px-3 py-1.5 text-xs font-bold bg-[#FBF2E3] hover:bg-[#F4E3C8] border border-[#DFC7A0] rounded-lg text-stone-900 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === cluster.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                          <span>Copied FAQ Schema</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                          <span>Copy FAQ JSON-LD</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
                    &ldquo;{cluster.query}&rdquo;
                  </h3>

                  <p className="text-sm text-stone-700 leading-relaxed">
                    {cluster.answerHook}
                  </p>

                  <div className="text-xs text-stone-600">
                    Related searches: {cluster.relatedLongTails.join(' · ')}
                  </div>

                  <div className="pt-3 border-t border-[#E6D0AC] flex flex-wrap items-center gap-4 text-xs font-bold">
                    <a
                      href={targetHref}
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenTarget(cluster.targetType, cluster.targetId);
                      }}
                      className="text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 underline underline-offset-4"
                    >
                      <span>Open {cluster.targetLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    <a
                      href={`?view=blog&post=${guideSlug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('blog', cluster.recommendedPostId);
                      }}
                      className="text-stone-800 hover:text-amber-900 inline-flex items-center gap-1 underline underline-offset-4"
                    >
                      <span>Read Full Guide</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <AdSenseUnit slot="8358033803" />
    </div>
  );
}
