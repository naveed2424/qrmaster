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
  version: '2026.1-ENTERPRISE',
  title: 'Master Prompt — Build a Professional SEO-Powered, Google AdSense-Ready Knowledge Platform',
  siteTopic: 'QR Code Engineering, Business Utility & Conversion Optimization',
  siteUrl: 'https://2qrcode.com/',
  language: 'English (US/UK/International)',
  monetizationReadiness: [
    'Google AdSense (Strict compliance: high originality, no thin content, clear editorial ownership)',
    'Affiliate disclosures clearly demarcated when relevant',
    'Zero intrusive popups, zero deceptive click traps',
    'Full GDPR, Cookie Policy, Terms of Service, and Editorial Policy compliance',
  ],
  eeatPillars: {
    experience: 'Practical real-world measurements (10:1 distance rule, 300 DPI calculations, actual scanner test procedures).',
    expertise: 'Technical accuracy verified against ISO/IEC 18004 QR specifications and Reed-Solomon mathematical proofs.',
    authoritativeness: 'Comprehensive topical coverage across 60+ specialized tools without shallow duplicate pages.',
    trust: 'Transparent creator profile, verified fact-checking, zero fake endorsements, and lifetime free access.',
  },
  geoAeoRules: [
    'Direct Answers: Every section must lead with a concise 40-50 word direct definition for instant AI snippet capture.',
    'Formulas & Calculations: Provide explicit numeric examples (e.g. Scan Distance / 10 = Minimum Print Width).',
    'Decision Trees: Include actionable checklists and bulleted comparison tables.',
    'Tool Interlinking: Contextually link directly to relevant 2qrcode.com generators inside article prose so readers can immediately launch the mentioned tool.',
    'Structured FAQs: Include 3-6 verified reader questions with direct, definitive answers.',
  ],
};
