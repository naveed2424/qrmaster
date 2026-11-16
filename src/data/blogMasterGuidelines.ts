/**
 * MASTER EDITORIAL GUIDELINES & PROMPT REGISTRY
 * Registered Master Prompt for all 2qrcode.com Blog Posts & Editorial Content
 * Compliance: Google AdSense Publisher Policies, E-E-A-T Standards, GEO/AEO Optimization
 */

export interface EditorialCategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetAudience: string;
  topicalAuthorityKeywords: string[];
}

export const BLOG_EDITORIAL_CATEGORIES: EditorialCategoryConfig[] = [
  {
    id: 'tutorials',
    name: 'QR Tutorials & Guides',
    slug: 'qr-tutorials-guides',
    description: 'Step-by-step practical walk-throughs for creating, testing, and deploying specialized QR formats including vCard, Wi-Fi, and Google Review cards.',
    targetAudience: 'Small business owners, marketers, event coordinators, and freelancers.',
    topicalAuthorityKeywords: ['how to create qr code', 'vcard qr tutorial', 'wifi qr code setup', 'google review qr code guide'],
  },
  {
    id: 'print-engineering',
    name: 'Print Engineering & Standards',
    slug: 'print-engineering-standards',
    description: 'Physical scannability standards, 10:1 viewing distance math, 300 DPI vector export, quiet zones, and paper substrate calibration.',
    targetAudience: 'Graphic designers, commercial print shops, signmakers, packaging engineers.',
    topicalAuthorityKeywords: ['qr code print size', '10:1 qr distance rule', '300 dpi qr vector svg', 'qr quiet zone margins'],
  },
  {
    id: 'business-marketing',
    name: 'QR Business & Marketing',
    slug: 'qr-business-marketing',
    description: 'Real-world playbooks for cafes, real estate, hospitality, retail unboxing, and service checkout conversions.',
    targetAudience: 'Entrepreneurs, cafe owners, restaurateurs, realtors, e-commerce brands.',
    topicalAuthorityKeywords: ['restaurant qr menu strategy', 'realtor qr code marketing', 'packaging unboxing qr', 'retail qr campaigns'],
  },
  {
    id: 'tech-security',
    name: 'Tech, Security & Privacy',
    slug: 'tech-security-privacy',
    description: 'Deep dives into Reed-Solomon error correction algorithms, air-gapped TOTP authentication, data privacy, and serverless decoding.',
    targetAudience: 'Software engineers, cybersecurity professionals, IT administrators.',
    topicalAuthorityKeywords: ['reed solomon error correction qr', 'static qr code privacy', 'air gapped 2fa qr', 'iso 18004 qr standard'],
  },
  {
    id: 'industry-exposes',
    name: 'Industry Reviews & Exposes',
    slug: 'industry-reviews-exposes',
    description: 'Investigative consumer reports on expiring QR generator scams, hidden subscription paywalls, and cost comparison analyses.',
    targetAudience: 'Victims of predatory QR generators, small business advocates, budget-conscious creators.',
    topicalAuthorityKeywords: ['expiring qr code scam', 'free vs paid qr generator', 'qr code subscription trap', 'lifetime free static qr'],
  },
  {
    id: 'conversions-growth',
    name: 'Conversions & Growth',
    slug: 'conversions-growth',
    description: 'Data-backed frame design, CTA psychology, color contrast testing, and measuring physical scans using free UTM analytics.',
    targetAudience: 'Conversion rate optimizers, growth marketers, brand directors.',
    topicalAuthorityKeywords: ['high converting qr frames', 'qr call to action copy', 'qr code contrast testing', 'google analytics qr tracking'],
  },
];

export const MASTER_PROMPT_REGISTRY = {
  version: '2026.2-PERMANENT-JOURNALIST',
  title: 'Master Editorial Prompt — SEO-Rich, AdSense-Ready Daily & Pillar Blog Publishing Standard',
  siteTopic: 'QR Code Engineering, AI Tools, Smart Cities, Tech Security & Digital Utility Publishing',
  siteUrl: 'https://2qrcode.com/',
  language: 'English (US/UK/International)',
  monetizationReadiness: [
    'Google AdSense (Strict compliance: high originality, 2000+ word depth, no thin content, clear editorial ownership)',
    'Affiliate disclosures clearly demarcated when relevant',
    'Zero intrusive popups, zero deceptive click traps',
    'Full GDPR, Cookie Policy, Terms of Service, and Editorial Policy compliance',
  ],
  eeatPillars: {
    experience: 'Practical real-world measurements, live trend research, and hands-on engineering benchmarks.',
    expertise: 'Technical accuracy verified against ISO/IEC 18004 standards and primary research reports (Stanford HAI, Pew, WEF, Google Search Central).',
    authoritativeness: 'Comprehensive topical coverage across 70+ specialized tools and 6 structured categories.',
    trust: 'Transparent creator profile, zero duplicate/recycled photos, verified external citations, and lifetime free utility access.',
  },
  geoAeoRules: [
    'Direct Answers: Every section leads with a crisp 40-50 word direct answer for search snippets and AI citations.',
    'Concrete Numbers & Tables: Provide explicit statistics, primary source citations, and scannable comparison tables.',
    'Internal & External Authority Graph: Contextually link 2–5 internal 2qrcode.com tools/articles plus 1–3 authoritative external institutions.',
    'Structured FAQs: Include 3–4 verified reader questions with direct, actionable answers.',
  ],
  dailyTrendingSeoPrompt: {
    lockedForAllFuturePosts: true,
    triggerPhrase: "Write today's best and trending topic",
    minWords: 2000,
    requiredMedia: '1 unique photorealistic featured image + 4 unique in-content images (photorealistic scenes + bespoke SVG data charts/infographics) with keyword-rich descriptive ALT text and ZERO duplicate photos across the entire site',
    requiredSeoFields: [
      'CTR-Focused Headline & Primary Keyword',
      '3–6 Secondary Keywords & Semantic Variations',
      'SEO Meta Title & Meta Description (150–160 characters)',
    ],
    requiredLinks: '2–5 internal site/post/tool links ([Anchor](tool:...), [Anchor](view:...), [Anchor](post:...)) + 1–3 authoritative external citations/backlinks',
    outputSections: [
      'Title, Meta Title & Meta Description (150–160 chars)',
      'Engaging Hook Introduction (Why this topic matters right now)',
      'Clear Beginner Background / Context',
      'Structured H2 & H3 Sections (Latest Developments, Key Facts & Statistics, Expert Insights, Real-World Impact)',
      'In-Content Visual Media + Descriptive SEO ALT Text (4 placed naturally between sections)',
      'Internal Linking + Authoritative External Backlinks',
      'Key Takeaways / Quick Summary',
      'FAQ Section (2–4 Questions)',
      'Strong Conclusion, Future Outlook & Reader CTA',
    ],
  },
};
