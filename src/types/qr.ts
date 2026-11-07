export type QRCategory =
  | 'all'
  | 'web'
  | 'social'
  | 'business'
  | 'communication'
  | 'media'
  | 'events'
  | 'tech'
  | 'finance';

export interface QRField {
  id: string;
  label: string;
  type: 'text' | 'url' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'datetime-local' | 'checkbox' | 'color';
  placeholder?: string;
  defaultValue?: string | boolean | number;
  options?: { label: string; value: string }[];
  helperText?: string;
  required?: boolean;
}

export interface QRToolFAQ {
  question: string;
  answer: string;
}

export interface QRGeneratorTool {
  id: string;
  name: string;
  category: QRCategory;
  iconName: string;
  badge?: string;
  shortDescription: string;
  detailedDescription: string;
  rating: number;
  ratingCount: number;
  fields: QRField[];
  defaultPayloadGenerator: (values: Record<string, any>) => string;
  defaultValues: Record<string, any>;
  guide: {
    wayToUse: string;
    whereToUse: string[];
    howToUse: string[];
    whoCanProfit: {
      role: string;
      benefit: string;
    }[];
    faqs: QRToolFAQ[];
  };
}

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy';
export type CornerStyle = 'square' | 'rounded' | 'extra-rounded' | 'circle';
export type FrameType = 'none' | 'bottom-bar' | 'top-header' | 'polaroid' | 'badge' | 'minimal-tag';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCustomization {
  fgColor: string;
  bgColor: string;
  useGradient: boolean;
  gradientColor2: string;
  gradientAngle: number;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  eyeFrameColor: string;
  eyeBallColor: string;
  errorCorrection: ErrorCorrectionLevel;
  size: number;
  logoPreset: string | null;
  customLogoUrl: string | null;
  logoSizePercent: number; // 15 to 30%
  frameType: FrameType;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
}

export type BlogCategory =
  | 'QR Tutorials & Guides'
  | 'Print Engineering & Standards'
  | 'QR Business & Marketing'
  | 'Tech, Security & Privacy'
  | 'Industry Reviews & Exposes'
  | 'Conversions & Growth';

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  category: BlogCategory;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  author: string;
  authorRole?: string;
  tags: string[];
  keyTakeaways?: string[];
  relatedToolIds?: string[];
  faqs?: BlogFAQ[];
}

export interface UserReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  toolUsed: string;
  comment: string;
  verified: boolean;
}

export type SupportedLanguage =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'it'
  | 'ja'
  | 'ar'
  | 'zh'
  | 'hi'
  | 'ru'
  | 'ko'
  | 'tr'
  | 'id'
  | 'nl'
  | 'pl';
