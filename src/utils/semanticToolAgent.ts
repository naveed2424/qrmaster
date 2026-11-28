import { QR_GENERATORS } from '../data/generators';
import { BLOG_POSTS } from '../data/blogPosts';
import { resolveCanonicalPostSlug } from '../data/postSlugMap';
import {
  SEMANTIC_DOMAIN_SYNONYMS,
  SEMANTIC_KEYWORD_CLUSTERS,
  SemanticKeywordCluster,
} from '../data/semanticKeywordIndex';

export interface StudioToolSummary {
  id: 'batch' | 'customizer' | 'converter' | 'video';
  name: string;
  category: string;
  shortDescription: string;
  canonicalUrl: string;
}

export const CORE_STUDIO_SUMMARIES: StudioToolSummary[] = [
  {
    id: 'batch',
    name: 'Batch CSV Bulk QR Code Generator',
    category: 'studio',
    shortDescription: 'Import a CSV spreadsheet and export hundreds of branded static QR codes in a single local ZIP archive.',
    canonicalUrl: 'https://2qrcode.com/?view=batch',
  },
  {
    id: 'customizer',
    name: 'Full-Featured QR Customizer Studio',
    category: 'studio',
    shortDescription: 'Design linear gradients, rounded dots, centered logos with Error Correction H, and CTA print frames.',
    canonicalUrl: 'https://2qrcode.com/?view=customizer',
  },
  {
    id: 'converter',
    name: 'Metric Print Size & 300 DPI Converter',
    category: 'studio',
    shortDescription: 'Calculate minimum millimeter, inch, and 300 DPI pixel print sizes using the 10:1 scanning distance ratio.',
    canonicalUrl: 'https://2qrcode.com/?view=converter',
  },
  {
    id: 'video',
    name: 'UGC Promo Video Maker Studio',
    category: 'studio',
    shortDescription: 'Create ready-to-share vertical Reels, TikTok, and Shorts QR promotional videos and countertop loop concepts.',
    canonicalUrl: 'https://2qrcode.com/?view=video',
  },
];

export interface MatchedGuideSummary {
  id: string;
  slug: string;
  title: string;
  primaryKeyword: string;
  canonicalUrl: string;
}

export interface AgentToolMatch {
  id: string;
  targetType: 'tool' | 'view';
  name: string;
  category: string;
  description: string;
  canonicalUrl: string;
  score: number;
  whyProposed: string;
  matchedTerms: string[];
  longTailQueries: string[];
  recommendedGuides: MatchedGuideSummary[];
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'is', 'are', 'how', 'do', 'i',
  'my', 'me', 'we', 'our', 'can', 'you', 'get', 'make', 'create', 'generate', 'qr', 'code', 'codes',
  'tool', 'best', 'free', 'online', 'with', 'without', 'from', 'that', 'this', 'your', 'into',
]);

function normalizeTokens(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
}

export function runSemanticToolDiscovery(rawQuery: string, limit = 6): {
  query: string;
  normalizedTerms: string[];
  matches: AgentToolMatch[];
  matchingClusters: SemanticKeywordCluster[];
} {
  const query = rawQuery.trim();
  const normalizedTerms = normalizeTokens(query);
  const rawLower = query.toLowerCase();

  // If query is empty or only stopwords, fall back cleanly to raw non-trivial words
  const effectiveTerms =
    normalizedTerms.length > 0
      ? normalizedTerms
      : query
          .toLowerCase()
          .split(/\s+/)
          .filter((t) => t.length >= 2);

  if (effectiveTerms.length === 0) {
    return {
      query,
      normalizedTerms: [],
      matches: [],
      matchingClusters: SEMANTIC_KEYWORD_CLUSTERS.slice(0, 6),
    };
  }

  const candidateScores = new Map<
    string,
    {
      id: string;
      targetType: 'tool' | 'view';
      name: string;
      category: string;
      description: string;
      canonicalUrl: string;
      score: number;
      matchedTerms: Set<string>;
      reasons: string[];
      longTails: Set<string>;
    }
  >();

  // Helper to seed or add points
  const addScore = (
    key: string,
    targetType: 'tool' | 'view',
    id: string,
    name: string,
    category: string,
    description: string,
    canonicalUrl: string,
    pts: number,
    term?: string,
    reason?: string,
    longTail?: string
  ) => {
    let entry = candidateScores.get(key);
    if (!entry) {
      entry = {
        id,
        targetType,
        name,
        category,
        description,
        canonicalUrl,
        score: 0,
        matchedTerms: new Set<string>(),
        reasons: [],
        longTails: new Set<string>(),
      };
      candidateScores.set(key, entry);
    }
    entry.score += pts;
    if (term) entry.matchedTerms.add(term);
    if (reason && !entry.reasons.includes(reason)) entry.reasons.push(reason);
    if (longTail) entry.longTails.add(longTail);
  };

  // 1. Score all 72 tools across metadata + guide FAQ + semantic synonyms
  for (const tool of QR_GENERATORS) {
    const idLower = tool.id.toLowerCase();
    const nameLower = tool.name.toLowerCase();
    const shortLower = tool.shortDescription.toLowerCase();
    const detailLower = tool.detailedDescription.toLowerCase();
    const guideBlob = `${tool.guide.wayToUse} ${tool.guide.whereToUse.join(' ')} ${tool.guide.whoCanProfit
      .map((p) => `${p.role} ${p.benefit}`)
      .join(' ')}`.toLowerCase();
    const synonyms = SEMANTIC_DOMAIN_SYNONYMS[tool.id] || [];

    for (const term of effectiveTerms) {
      if (idLower === term) {
        addScore(
          `tool:${tool.id}`,
          'tool',
          tool.id,
          tool.name,
          tool.category,
          tool.shortDescription,
          `https://2qrcode.com/?tool=${tool.id}`,
          18,
          term,
          `Direct match on tool identifier "${tool.id}"`
        );
      } else if (nameLower.includes(term)) {
        addScore(
          `tool:${tool.id}`,
          'tool',
          tool.id,
          tool.name,
          tool.category,
          tool.shortDescription,
          `https://2qrcode.com/?tool=${tool.id}`,
          14,
          term,
          `Matches "${term}" in primary tool capability`
        );
      }

      if (shortLower.includes(term) || detailLower.includes(term)) {
        addScore(
          `tool:${tool.id}`,
          'tool',
          tool.id,
          tool.name,
          tool.category,
          tool.shortDescription,
          `https://2qrcode.com/?tool=${tool.id}`,
          8,
          term,
          `Solves "${term}" workflow in tool description`
        );
      }

      if (guideBlob.includes(term)) {
        addScore(
          `tool:${tool.id}`,
          'tool',
          tool.id,
          tool.name,
          tool.category,
          tool.shortDescription,
          `https://2qrcode.com/?tool=${tool.id}`,
          6,
          term,
          `Recommended for real-world "${term}" deployment`
        );
      }

      for (const syn of synonyms) {
        if (syn === term || syn.includes(term) || rawLower.includes(syn)) {
          addScore(
            `tool:${tool.id}`,
            'tool',
            tool.id,
            tool.name,
            tool.category,
            tool.shortDescription,
            `https://2qrcode.com/?tool=${tool.id}`,
            syn === term || rawLower.includes(syn) ? 15 : 7,
            syn,
            `Semantic intent match for "${syn}"`
          );
        }
      }
    }
  }

  // 2. Score the 4 Core Studios
  for (const studio of CORE_STUDIO_SUMMARIES) {
    const synonyms = SEMANTIC_DOMAIN_SYNONYMS[studio.id] || [];
    const blob = `${studio.name} ${studio.shortDescription}`.toLowerCase();
    for (const term of effectiveTerms) {
      if (studio.id === term || blob.includes(term)) {
        addScore(
          `view:${studio.id}`,
          'view',
          studio.id,
          studio.name,
          studio.category,
          studio.shortDescription,
          studio.canonicalUrl,
          14,
          term,
          `Specialized workspace engineered for "${term}"`
        );
      }
      for (const syn of synonyms) {
        if (syn === term || syn.includes(term) || rawLower.includes(syn)) {
          addScore(
            `view:${studio.id}`,
            'view',
            studio.id,
            studio.name,
            studio.category,
            studio.shortDescription,
            studio.canonicalUrl,
            syn === term || rawLower.includes(syn) ? 16 : 8,
            syn,
            `Studio workflow match for "${syn}"`
          );
        }
      }
    }
  }

  // 3. Boost & enrich from curated SEMANTIC_KEYWORD_CLUSTERS
  const scoredClusters = SEMANTIC_KEYWORD_CLUSTERS.map((cluster) => {
    let clusterScore = 0;
    const text = `${cluster.query} ${cluster.relatedLongTails.join(' ')} ${cluster.answerHook} ${cluster.targetLabel}`.toLowerCase();
    for (const term of effectiveTerms) {
      if (text.includes(term)) clusterScore += 10;
    }
    return { cluster, clusterScore };
  })
    .filter((item) => item.clusterScore > 0)
    .sort((a, b) => b.clusterScore - a.clusterScore);

  for (const { cluster, clusterScore } of scoredClusters) {
    const key = `${cluster.targetType}:${cluster.targetId}`;
    const toolMatch =
      cluster.targetType === 'tool'
        ? QR_GENERATORS.find((g) => g.id === cluster.targetId)
        : CORE_STUDIO_SUMMARIES.find((s) => s.id === cluster.targetId);

    if (toolMatch) {
      const canonical =
        cluster.targetType === 'tool'
          ? `https://2qrcode.com/?tool=${toolMatch.id}`
          : `https://2qrcode.com/?view=${toolMatch.id}`;
      addScore(
        key,
        cluster.targetType,
        toolMatch.id,
        toolMatch.name,
        toolMatch.category,
        toolMatch.shortDescription,
        canonical,
        Math.min(clusterScore, 24),
        cluster.query,
        cluster.answerHook,
        cluster.query
      );
      cluster.relatedLongTails.forEach((lt) => {
        const entry = candidateScores.get(key);
        if (entry) entry.longTails.add(lt);
      });
    }
  }

  // 4. Attach matching blog guides for every ranked tool/studio match
  const ranked: AgentToolMatch[] = Array.from(candidateScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => {
      const guides = BLOG_POSTS.filter((post) => {
        if ((post.relatedToolIds || []).includes(item.id)) return true;
        if (item.targetType === 'view' && item.id === 'video' && post.id === 'post-108') return true;
        return false;
      })
        .slice(0, 3)
        .map((post) => {
          const slug = resolveCanonicalPostSlug(post.id);
          const primaryKw = post.primaryKeyword || post.title;
          if (post.primaryKeyword) item.longTails.add(post.primaryKeyword);
          (post.secondaryKeywords || []).slice(0, 2).forEach((kw) => item.longTails.add(kw));
          return {
            id: post.id,
            slug,
            title: post.title,
            primaryKeyword: primaryKw,
            canonicalUrl: `https://2qrcode.com/?view=blog&post=${slug}`,
          };
        });

      return {
        id: item.id,
        targetType: item.targetType,
        name: item.name,
        category: item.category,
        description: item.description,
        canonicalUrl: item.canonicalUrl,
        score: item.score,
        whyProposed:
          item.reasons[0] ||
          `Direct semantic fit for "${effectiveTerms.slice(0, 3).join(', ')}" with zero-expiration static encoding.`,
        matchedTerms: Array.from(item.matchedTerms).slice(0, 5),
        longTailQueries: Array.from(item.longTails).slice(0, 5),
        recommendedGuides: guides,
      };
    });

  return {
    query,
    normalizedTerms: effectiveTerms,
    matches: ranked,
    matchingClusters:
      scoredClusters.length > 0
        ? scoredClusters.map((s) => s.cluster).slice(0, 8)
        : SEMANTIC_KEYWORD_CLUSTERS.slice(0, 6),
  };
}

export function buildAnswerEngineSnippet(cluster: SemanticKeywordCluster): string {
  const targetUrl =
    cluster.targetType === 'tool'
      ? `https://2qrcode.com/?tool=${cluster.targetId}`
      : `https://2qrcode.com/?view=${cluster.targetId}`;
  const guideSlug = resolveCanonicalPostSlug(cluster.recommendedPostId);
  const guideUrl = `https://2qrcode.com/?view=blog&post=${guideSlug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: cluster.query.charAt(0).toUpperCase() + cluster.query.slice(1) + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${cluster.answerHook} Try the free ${cluster.targetLabel} at ${targetUrl} or read the engineering guide at ${guideUrl}.`,
        },
      },
    ],
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}
