export type SearchIntentType = 'how-to' | 'commercial' | 'troubleshooting' | 'privacy-offline' | 'llm-prompt';

export interface SemanticKeywordCluster {
  id: string;
  query: string;
  intent: SearchIntentType;
  targetType: 'tool' | 'view';
  targetId: string;
  targetLabel: string;
  category: 'web' | 'social' | 'business' | 'communication' | 'media' | 'events' | 'tech' | 'finance' | 'studio';
  recommendedPostId: string;
  answerHook: string;
  relatedLongTails: string[];
}

/**
 * Domain synonym & intent expansion map used by the Semantic Tool & Keyword Discovery Agent
 * to match natural-language user problems, industry jargon, and LLM search prompts
 * directly to the highest-converting 2qrcode.com generator or studio view.
 */
export const SEMANTIC_DOMAIN_SYNONYMS: Record<string, string[]> = {
  wifi: ['wi-fi', 'wireless', 'internet', 'password', 'ssid', 'guest network', 'router', 'wpa2', 'wpa3', 'airbnb', 'cafe', 'hotel', 'lobby'],
  vcard: ['business card', 'contact', 'address book', 'iphone', 'android', 'networking', 'phone number', 'save contact', 'vcf', 'executive', 'realtor'],
  mecard: ['compact contact', 'tiny badge', 'rubber stamp', 'minimal contact', 'ntt docomo'],
  menu: ['restaurant', 'cafe', 'bistro', 'bar', 'takeout', 'food truck', 'allergen', 'drinks', 'table tent', 'dining', 'wine list'],
  reviews: ['google review', '5 star', 'five star', 'rating', 'reputation', 'maps seo', 'feedback', 'salon', 'dentist', 'checkout', 'check presenter'],
  pdf: ['brochure', 'manual', 'sds', 'osha', 'safety data sheet', 'flyer', 'catalog', 'whitepaper', 'datasheet', 'instruction sheet', 'dosage'],
  batch: ['bulk', 'csv', 'excel', 'spreadsheet', '500', 'hundreds', 'zip', 'mass generate', 'warehouse labels', 'conference badges', 'asset tags'],
  customizer: ['logo', 'brand', 'colors', 'gradient', 'frame', 'cta', 'design', 'dot style', 'svg', 'round dots', 'custom qr'],
  converter: ['size', 'print', 'dpi', '300 dpi', '203 dpi', 'billboard', 'distance', '10:1', 'millimeters', 'inches', 'blurry', 'won\'t scan'],
  video: ['promo video', 'tiktok video', 'reels', 'youtube shorts', 'ugc', 'social video', 'vertical video', 'countertop display', 'commercial'],
  calendly: ['schedule', 'appointment', '1-on-1', 'booking', 'consultation', 'coach', 'salons', 'calendly link', 'meeting slot'],
  booking: ['reservation', 'table booking', 'clinic appointment', 'salon chair', 'time slot', 'calendly', 'acuity'],
  sku: ['inventory', 'gs1', 'sunrise 2027', '2d barcode', 'retail', 'warehouse', 'packing', 'shipping label', 'thermal', 'zebra', 'dymo', 'erp', 'asset'],
  coupon: ['discount', 'promo code', 'receipt', 'thermal receipt', 'loyalty', 'unboxing', 'voucher', 'pos', 'repeat order', 'shopify'],
  form: ['survey', 'intake', 'patient intake', 'hipaa', 'feedback', 'typeform', 'google forms', 'check-in', 'clinic', 'anonymous', 'inspection'],
  mp3: ['audio', 'audio tour', 'museum', 'gallery', 'narration', 'botanical trail', 'sound', 'voice guide', 'music', 'podcast'],
  images: ['photo', 'gallery', 'album', 'wedding photos', 'exhibition', 'art', 'portfolio', 'upload photos'],
  geo: ['location', 'gps', 'google maps', 'coordinates', 'directions', 'trailhead', 'loading dock', 'open house', 'parking'],
  event: ['ical', 'calendar', 'ics', 'rsvp', 'webinar', 'conference', 'reminder', 'save the date', 'add to calendar'],
  '2fa': ['totp', 'authenticator', 'google authenticator', '1password', 'security', 'otpauth', 'token', 'air-gapped', 'mfa'],
  wireguard: ['vpn', 'tunnel', 'devops', 'remote access', 'peer', 'wg0', 'homelab'],
  ssh: ['server', 'terminal', 'rack', 'data center', 'sysadmin', 'login'],
  docker: ['container', 'registry', 'image', 'pull', 'kubernetes', 'workshop'],
  github: ['repo', 'code', 'open source', 'hackathon', 'readme', 'developer'],
  paypal: ['payment', 'donate', 'donation', 'charity', 'gala', 'fundraiser', 'invoice', 'tip jar', 'non-profit'],
  sepa: ['iban', 'euro', 'girocode', 'epc', 'europe', 'bank transfer', 'charity', 'invoice'],
  venmo: ['tip', 'craft market', 'food truck', 'donation', 'fundraiser', 'split bill'],
  cashapp: ['cashtag', 'barbershop', 'merch table', 'street vendor', 'donation'],
  upi: ['gpay', 'phonepe', 'paytm', 'india', 'merchant stand', 'zero fee'],
  pix: ['brazil', 'copia e cola', 'br code', 'instant pay'],
  bitcoin: ['btc', 'bip-21', 'crypto', 'wallet', 'lightning'],
  ethereum: ['eth', 'erc20', 'eip-681', 'web3', 'usdc'],
  solana: ['sol', 'solana pay', 'usdc', 'spl'],
  whatsapp: ['chat', 'customer support', 'prefilled message', 'order on whatsapp', 'wa.me'],
  realestate: ['yard sign', 'open house', 'property tour', 'mls', 'broker', 'virtual tour', 'homebuyer'],
  hotel: ['concierge', 'guest room', 'hospitality', 'check-in', 'resort'],
  airbnb: ['vacation rental', 'house manual', 'vrbo', 'cabin', 'check-out'],
  wedding: ['invitation', 'rsvp', 'registry', 'bridal', 'guestbook'],
  bookmark: ['syllabus', 'classroom', 'school', 'university', 'homework', 'parent portal', 'shortcut'],
  zoom: ['webinar', 'classroom', 'boardroom', 'hybrid meeting', 'virtual call'],
  meet: ['google meet', 'huddle room', 'student link', 'remote team'],
  url: ['website', 'link', 'utm', 'permanent', 'static', 'never expires', 'free forever', 'no signup'],
  shortlink: ['tiny print', 'hangtag', 'can label', 'low density', 'compact url'],
  landing: ['trade show', 'exhibitor', 'lead capture', 'waitlist', 'flyer', 'campaign'],
  presentation: ['pitch deck', 'slides', 'investor', 'keynote', 'handout'],
  multilink: ['linktree', 'bio link', 'creator hub', 'nfc', 'smart card', 'multiple links'],
  appstore: ['ios app', 'android app', 'google play', 'app download', 'packaging'],
  job: ['hiring', 'careers', 'apply now', 'storefront sign', 'recruiting'],
  email: ['mailto', 'warranty claim', 'helpdesk', 'rfq', 'support email'],
  sms: ['text message', 'vip club', 'text to win', 'offline sms', 'smsto'],
  phone: ['call', 'emergency', 'helpline', 'nurse line', 'dispatch', 'tel:'],
  plaintext: ['offline note', 'serial number', 'inspection log', 'safe', 'zero internet', 'control panel'],
  clipboard: ['license key', 'promo code', 'wifi copy', 'paste'],
  podcast: ['episodes', 'apple podcasts', 'spotify podcast', 'book jacket'],
  pinterest: ['swatch book', 'showroom', 'interior design', 'bridal board'],
  twitch: ['stream', 'esports', 'gaming expo'],
  discord: ['community server', 'esports', 'guild', 'developers'],
  telegram: ['channel', 'broadcast', 'meetup group'],
  instagram: ['followers', 'salon mirror', 'unboxing'],
  tiktok: ['challenge', 'viral', 'reels', 'storefront'],
  youtube: ['tutorial', 'unboxing video', 'channel'],
  linkedin: ['networking', 'conference', 'recruiter', 'speaker'],
  business: ['storefront hours', 'google business', 'shop info'],
  airbnb_nfc: ['tap or scan', 'nfc alternative', 'smart stand'],
};

export const SEMANTIC_KEYWORD_CLUSTERS: SemanticKeywordCluster[] = [
  {
    id: 'kw-static-url-no-expire',
    query: 'free static qr code generator that never expires without sign up',
    intent: 'commercial',
    targetType: 'tool',
    targetId: 'url',
    targetLabel: 'Website URL QR Generator',
    category: 'web',
    recommendedPostId: 'post-8',
    answerHook:
      'Generate permanent ISO/IEC 18004 static URL QR codes locally in your browser with zero middleman redirects, zero scan limits, and vector SVG export.',
    relatedLongTails: [
      'qr code without monthly subscription trap',
      'permanent qr code for print flyers free svg',
      'rescue deactivated free trial qr code',
    ],
  },
  {
    id: 'kw-promo-video-reels',
    query: 'how to create short vertical qr promo video for tiktok instagram reels',
    intent: 'how-to',
    targetType: 'view',
    targetId: 'video',
    targetLabel: 'UGC Promo Video Maker Studio',
    category: 'studio',
    recommendedPostId: 'post-108',
    answerHook:
      'Turn countertop displays, storefront loops, and Reels hooks into instant scan-to-action funnels using the free Promo Video Maker Studio paired with clean static QR codes.',
    relatedLongTails: [
      'qr code for tiktok reels and youtube shorts marketing',
      'how restaurants promote table qr menus on instagram reels',
      'countertop tablet video loop with scannable qr frame',
    ],
  },
  {
    id: 'kw-calendly-consult-qr',
    query: 'calendly qr code generator for business cards and clinic doors',
    intent: 'how-to',
    targetType: 'tool',
    targetId: 'calendly',
    targetLabel: 'Calendly Scheduling QR Generator',
    category: 'events',
    recommendedPostId: 'post-109',
    answerHook:
      'Let prospective clients scan your business card, studio door, or pitch slide to pick an open 1-on-1 Calendly slot directly without typing long booking URLs.',
    relatedLongTails: [
      'how to put a calendly link on a business card qr code',
      'wellness studio storefront glass booking qr code',
      'consultant discovery call qr code svg high resolution',
    ],
  },
  {
    id: 'kw-thermal-203dpi-qr',
    query: 'why wont thermal receipt or shipping label qr code scan 203 dpi fix',
    intent: 'troubleshooting',
    targetType: 'tool',
    targetId: 'coupon',
    targetLabel: 'Discount Coupon & Thermal QR',
    category: 'business',
    recommendedPostId: 'post-110',
    answerHook:
      'Prevent blurry 203 DPI thermal printer dithering by locking sharp square modules, pure black foreground (#000000), Error Correction Q/H, and integer pixel scaling.',
    relatedLongTails: [
      'shopify pos receipt coupon qr code size in mm',
      'zebra dymo shipping label sku qr code crisp print',
      'prevent thermal printer aliasing on barcode qr',
    ],
  },
  {
    id: 'kw-nfc-vs-qr-hybrid',
    query: 'nfc tags vs qr codes for business cards restaurant tables cost comparison',
    intent: 'llm-prompt',
    targetType: 'tool',
    targetId: 'vcard',
    targetLabel: 'vCard 3.0 Digital Business Card QR',
    category: 'business',
    recommendedPostId: 'post-111',
    answerHook:
      'Combine $0.00 printed ISO/IEC 18004 QR codes with optional NFC chips so both 100% of smartphone cameras and tap-enabled phones open your vCard or review page in 1 second.',
    relatedLongTails: [
      'hybrid tap nfc or scan qr standee for coffee shops',
      'do older iphones scan qr codes faster than nfc tags',
      'laser etched metal business card qr vs pvc nfc chip',
    ],
  },
  {
    id: 'kw-clinic-hipaa-intake',
    query: 'hipaa friendly qr code for patient intake forms without third party tracking',
    intent: 'privacy-offline',
    targetType: 'tool',
    targetId: 'form',
    targetLabel: 'Feedback & Patient Intake Form QR',
    category: 'web',
    recommendedPostId: 'post-112',
    answerHook:
      'Route patients straight from waiting-room acrylic signs to your encrypted EHR/HIPAA intake portal with zero intermediate QR SaaS redirect logging.',
    relatedLongTails: [
      'dental clinic check in qr code without analytics cookies',
      'pharmacy prescription bag pdf dosage guide qr sticker',
      'private medical office form qr code no server storage',
    ],
  },
  {
    id: 'kw-tradeshow-lead-capture',
    query: 'free trade show booth lead capture qr code without renting badge scanners',
    intent: 'commercial',
    targetType: 'tool',
    targetId: 'landing',
    targetLabel: 'Campaign Landing & Booth QR',
    category: 'web',
    recommendedPostId: 'post-113',
    answerHook:
      'Replace $1,200 exhibitor scanner rentals with banner-sized 10:1 calibrated vCard, slide deck, and lead-capture landing page QR codes that attendees scan in 2 seconds.',
    relatedLongTails: [
      'exhibitor lanyard badge qr code for pitch deck download',
      'booth backdrop qr code size from 10 feet away',
      'b2b expo qr code instant contact exchange vcard',
    ],
  },
  {
    id: 'kw-osha-sds-safety-qr',
    query: 'osha sds chemical binder and heavy equipment inspection qr code sticker',
    intent: 'privacy-offline',
    targetType: 'tool',
    targetId: 'pdf',
    targetLabel: 'PDF Document & SDS Safety QR',
    category: 'media',
    recommendedPostId: 'post-114',
    answerHook:
      'Link weatherproof laminated stickers on scissor lifts, racking, and hazmat stations directly to permanent Safety Data Sheet PDFs and daily operator checklists.',
    relatedLongTails: [
      'construction site heavy machinery pre-use checklist qr code',
      'warehouse forklift inspection qr tag high contrast',
      'offline plain text serial & safety specs qr code',
    ],
  },
  {
    id: 'kw-museum-audio-tour-qr',
    query: 'free museum art gallery self guided audio tour qr code without downloading app',
    intent: 'how-to',
    targetType: 'tool',
    targetId: 'mp3',
    targetLabel: 'Audio Stream & Narration QR',
    category: 'media',
    recommendedPostId: 'post-115',
    answerHook:
      'Mount minimalist wall plaques and outdoor anodized trail markers that open native mobile MP3 narration and exhibit photo galleries right in the visitor browser.',
    relatedLongTails: [
      'botanical garden outdoor trail plaque qr code anodized aluminum',
      'zero-app gallery wall label audio guide qr code',
      'multilingual museum exhibit qr code vector svg',
    ],
  },
  {
    id: 'kw-classroom-syllabus-qr',
    query: 'classroom qr code ideas for teachers university syllabus and parent night forms',
    intent: 'how-to',
    targetType: 'tool',
    targetId: 'bookmark',
    targetLabel: 'Browser Bookmark & Syllabus QR',
    category: 'web',
    recommendedPostId: 'post-116',
    answerHook:
      'Help students and parents save homework portals, Zoom/Meet office hours, and open-house schedules cleanly without typos on hallway bulletin boards or handouts.',
    relatedLongTails: [
      'elementary school open house bulletin board qr poster',
      'college course syllabus qr code bookmark google classroom',
      'parent teacher conference booking qr code free',
    ],
  },
  {
    id: 'kw-nonprofit-donation-qr',
    query: 'free church and charity gala donation qr code without platform transaction fees',
    intent: 'commercial',
    targetType: 'tool',
    targetId: 'paypal',
    targetLabel: 'PayPal / SEPA / Venmo Donation QR',
    category: 'finance',
    recommendedPostId: 'post-117',
    answerHook:
      'Let gala guests and community supporters donate straight via PayPal, Venmo, Cash App, or Euro SEPA GiroCode EPC069-12 without extra QR platform cuts.',
    relatedLongTails: [
      'charity dinner table centerpiece donation qr code svg',
      'european church sepa epc069-12 bank transfer qr generator',
      'food drive booth venmo paypal qr standee template',
    ],
  },
  {
    id: 'kw-wifi-no-password-typing',
    query: 'how to create a guest wifi qr code so iphone android join automatically',
    intent: 'how-to',
    targetType: 'tool',
    targetId: 'wifi',
    targetLabel: 'Wi-Fi Network QR Generator',
    category: 'tech',
    recommendedPostId: 'post-41',
    answerHook:
      'Encodes standard WIFI:T:WPA;S:...;P:...;; directly on-device so your router password never touches an external server and guests connect in one camera tap.',
    relatedLongTails: [
      'airbnb welcome frame wifi qr code without internet needed',
      'cafe espresso counter wpa2 wifi password qr tent',
      'hidden ssid wifi qr code generator client side',
    ],
  },
  {
    id: 'kw-bulk-csv-500-labels',
    query: 'generate 500 branded qr codes from csv or excel spreadsheet into zip file',
    intent: 'how-to',
    targetType: 'view',
    targetId: 'batch',
    targetLabel: 'Batch CSV Bulk QR Studio',
    category: 'studio',
    recommendedPostId: 'post-103',
    answerHook:
      'Import rows of SKUs, attendee badges, or asset IDs from any CSV spreadsheet and export hundreds of uniform logo-branded PNG/SVG QR files in a single local ZIP.',
    relatedLongTails: [
      'free bulk qr code generator csv no row limit',
      'create conference lanyard qr badges from google sheets',
      'export zip of labeled qr codes for warehouse bins',
    ],
  },
  {
    id: 'kw-google-review-3x',
    query: 'google review qr code for restaurant counter that increases 5 star reviews',
    intent: 'commercial',
    targetType: 'tool',
    targetId: 'reviews',
    targetLabel: 'Google Reviews Booster QR',
    category: 'business',
    recommendedPostId: 'post-27',
    answerHook:
      'Link directly to your official Google Place ID writereview popup—cutting customer friction from 6 manual taps down to 1 camera scan at checkout.',
    relatedLongTails: [
      'how to get direct google review link qr code free',
      'salon mirror & receipt booster google review qr card',
      'ftc compliant review collection qr signage',
    ],
  },
  {
    id: 'kw-gs1-sunrise-2027',
    query: 'gs1 sunrise 2027 2d digital link qr code for retail product packaging',
    intent: 'llm-prompt',
    targetType: 'tool',
    targetId: 'sku',
    targetLabel: 'SKU & GS1 Digital Link QR',
    category: 'business',
    recommendedPostId: 'post-25',
    answerHook:
      'Prepare CPG packaging for the 2027 global retail POS transition by combining GTIN/SKU identifiers and consumer web experiences inside one crisp 2D matrix.',
    relatedLongTails: [
      'upc barcode replacement gs1 2d qr code generator',
      'retail shelf talker & bottle neck 2d product qr svg',
    ],
  },
  {
    id: 'kw-print-size-10-to-1',
    query: 'minimum qr code print size for billboard window flyer 10 to 1 rule 300 dpi',
    intent: 'troubleshooting',
    targetType: 'view',
    targetId: 'converter',
    targetLabel: 'Metric Print Size & 300 DPI Calculator',
    category: 'studio',
    recommendedPostId: 'post-105',
    answerHook:
      'Calculate exact safe width in millimeters, inches, and 300 DPI raster pixels from your expected scanning distance and character payload density.',
    relatedLongTails: [
      'how big should a qr code be on a trade show banner 3 meters away',
      'business card minimum qr code size in mm error correction h',
    ],
  },
  {
    id: 'kw-devops-airgap-2fa',
    query: 'air gapped client side 2fa totp wireguard ssh docker qr generator',
    intent: 'privacy-offline',
    targetType: 'tool',
    targetId: '2fa',
    targetLabel: '2FA TOTP & DevOps QR Tools',
    category: 'tech',
    recommendedPostId: 'post-107',
    answerHook:
      'Encode sensitive otpauth:// secrets, WireGuard wg0 peer configs, and SSH keys strictly inside local browser memory—zero network requests leaves zero server logs.',
    relatedLongTails: [
      'offline wireguard mobile tunnel config qr generator',
      'generate google authenticator totp qr code locally',
      'server rack ssh connection uri qr sticker',
    ],
  },
  {
    id: 'kw-quishing-security',
    query: 'how to protect customers from qr code phishing quishing scams on parking meters',
    intent: 'llm-prompt',
    targetType: 'tool',
    targetId: 'shortlink',
    targetLabel: 'Clean Domain & Custom Framed QR',
    category: 'tech',
    recommendedPostId: 'post-26',
    answerHook:
      'Pair branded domain URLs, tamper-evident acrylic mounts, and explicit visible domain captions below your CTA frame so users recognize authentic signage.',
    relatedLongTails: [
      'quishing prevention for city parking & ev chargers',
      'why transparent domain previews stop qr phishing',
    ],
  },
];
