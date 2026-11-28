import express from 'express';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const distIndex = path.join(distDir, 'index.html');

// Automatically build dist/ if hosting platform launches npm start without running build first
if (!fs.existsSync(distIndex)) {
  const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  if (fs.existsSync(viteBin)) {
    console.log('[2qrcode.com] Building static production bundle...');
    execFileSync(process.execPath, [viteBin, 'build'], {
      cwd: __dirname,
      stdio: 'inherit',
    });
  } else {
    console.error('[2qrcode.com] Missing dist/index.html and vite binary.');
    process.exit(1);
  }
}

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const INDEX_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

const VIEW_META = {
  directory: {
    title: '2qrcode.com – 70+ Free QR Code Generators, Batch CSV & Customizer',
    description:
      'Generate 70+ types of permanent static QR codes and bulk CSV batches for free on 2qrcode.com with custom logos, colors, CTA frames, and 300 DPI SVG/PNG/JPG export.',
    canonical: 'https://2qrcode.com/',
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
      '117 E-E-A-T verified guides covering dedicated QR tools, GS1 Sunrise 2027 2D barcodes, quishing security, Google Review growth, offline QR codes, and print engineering.',
    canonical: 'https://2qrcode.com/?view=blog',
  },
  reviews: {
    title: 'Verified User Reviews & Trust Ratings | 2qrcode.com',
    description:
      'Read verified reviews and real-world case ratings from businesses using 2qrcode.com free static QR tools.',
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
    description:
      'Read 2qrcode.com client-side privacy architecture and zero-storage QR code generation policy.',
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
  agent: {
    title: 'Semantic QR Tool & Long-Tail Keyword Finder | 2qrcode.com',
    description:
      'Match any business workflow, search query, or AI prompt across 72 specialized QR code generators, 4 studio workspaces, and 117 engineering guides.',
    canonical: 'https://2qrcode.com/?view=agent',
  },
};

const TOOL_LABELS = {
  url: 'Website URL',
  multilink: 'Multi-Link Bio',
  landing: 'Dynamic Landing Page',
  appstore: 'App Store & Play Store',
  bookmark: 'Browser Bookmark',
  shortlink: 'Short Link URL',
  form: 'Survey & Form',
  portfolio: 'Portfolio & Resume',
  instagram: 'Instagram Profile',
  whatsapp: 'WhatsApp Chat',
  facebook: 'Facebook Page',
  youtube: 'YouTube Video',
  tiktok: 'TikTok Profile',
  twitter: 'X / Twitter Profile',
  linkedin: 'LinkedIn Profile',
  telegram: 'Telegram Channel',
  discord: 'Discord Invite',
  spotify: 'Spotify Song & Playlist',
  threads: 'Threads Profile',
  vcard: 'vCard 3.0 Business Card',
  menu: 'Restaurant Menu',
  coupon: 'Discount Coupon',
  business: 'Business Profile Hub',
  reviews: 'Google Reviews',
  sku: 'Product SKU Inventory',
  realestate: 'Real Estate Property',
  booking: 'Appointment Booking',
  job: 'Job Posting',
  email: 'Direct Email',
  sms: 'SMS Text Message',
  phone: 'One-Tap Phone Call',
  facetime: 'FaceTime Call',
  skype: 'Skype Call & Chat',
  viber: 'Viber Chat',
  mecard: 'MeCard Contact',
  pdf: 'PDF Document',
  mp3: 'Audio Stream MP3',
  video: 'Video Stream',
  images: 'Photo Gallery',
  presentation: 'Slide & Pitch Deck',
  ebook: 'eBook Reader',
  event: 'Calendar Event (iCal)',
  zoom: 'Zoom Meeting',
  meet: 'Google Meet',
  geo: 'Google Maps GPS Location',
  boardingpass: 'Boarding Pass',
  hotel: 'Hotel Check-In',
  wedding: 'Wedding RSVP',
  wifi: 'Wi-Fi Login',
  '2fa': '2FA Authenticator (TOTP)',
  plaintext: 'Plain Text',
  clipboard: 'Clipboard Copy',
  github: 'GitHub Repository',
  ssh: 'SSH Server Connection',
  wireguard: 'WireGuard VPN Config',
  bitcoin: 'Bitcoin Wallet',
  ethereum: 'Ethereum & ERC-20',
  solana: 'Solana Wallet',
  paypal: 'PayPal Payment',
  upi: 'India UPI Payment',
  venmo: 'Venmo Handle',
  cashapp: 'Cash App Cashtag',
  sepa: 'SEPA EPC Bank Transfer',
  pix: 'Brazil Pix Instant Pay',
  podcast: 'Podcast RSS',
  twitch: 'Twitch Live Channel',
  pinterest: 'Pinterest Board',
  calendly: 'Calendly Scheduling',
  airbnb: 'Airbnb Welcome Guide',
  matter: 'Matter Smart Home',
  docker: 'Docker Container Image',
  rss: 'RSS Atom News Feed',
};

const LEGACY_SLUGS = {
  'quishing-qr-code-phishing-scams-protection-guide-2026':
    'quishing-qr-code-phishing-scams-parking-meter-security-guide',
  'google-review-qr-code-get-more-5-star-reviews-2026':
    'google-review-qr-code-triple-5-star-ratings-local-seo-2026',
  'offline-qr-codes-wifi-vcard-ical-plaintext-without-internet':
    'offline-zero-signal-qr-codes-wifi-vcard-ical-no-internet',
  'why-printed-qr-code-wont-scan-fix-12-print-ink-mistakes':
    'why-qr-code-wont-scan-print-ink-contrast-troubleshooting',
  'why-qr-code-wont-scan-fix-12-print-ink-mistakes':
    'why-qr-code-wont-scan-print-ink-contrast-troubleshooting',
  'free-qr-code-expired-deactivated-scam-rescue-permanent-static-qr':
    'free-qr-code-expired-how-to-decode-rescue-rebuild-forever',
};

const POST_ID_SLUGS = {
  'post-1': 'high-converting-qr-frames-cta-strategies',
  'post-2': 'add-logos-to-qr-codes-error-correction-guide',
  'post-3': 'dynamic-vs-static-qr-codes-small-businesses',
  'post-4': '60-creative-ways-businesses-creators-profit-from-qr-codes',
  'post-5': 'definitive-guide-qr-code-print-sizing-10-to-1-ratio-dpi-math',
  'post-6': 'restaurants-eliminate-menu-printing-costs-free-qr-wifi',
  'post-7': 'vcard-3-vs-traditional-paper-business-cards-2026-playbook',
  'post-8': 'exposing-expiring-qr-code-scam-subscription-traps',
  'post-9': 'bulk-generate-500-standardized-qr-codes-from-csv-spreadsheet',
  'post-10': 'contactless-crypto-paypal-upi-qr-payments-checkout-guide',
  'post-11': 'zero-typing-customer-support-whatsapp-ical-gps-2fa-qr-codes',
  'post-12': 'social-media-creator-qr-codes-double-follower-conversion',
  'post-13': 'service-business-real-estate-clinics-hotel-qr-workflows',
  'post-14': 'pdf-manuals-slide-decks-github-resumes-clean-qr-density-guide',
  'post-15': 'ai-in-daily-life-2026-benefits-hidden-side-effects-guide',
  'post-16': 'ai-workplace-automation-burnout-career-resilience-2026',
  'post-17': 'living-in-big-city-guided-by-ai-two-decades-transformation',
  'post-18': 'big-city-daily-survival-playbook-ai-menus-cashless-privacy',
  'post-19': 'agentic-ai-security-shift-google-trends-november-2026',
  'post-20': 'google-november-2026-core-update-ai-compute-trends-seo',
  'post-21': 'gartner-november-2026-ai-governance-agent-risks-chip-controls',
  'post-22': 'fbi-warning-free-online-file-converters-malware-webassembly-safety',
  'post-23': 'browser-webgpu-local-edge-ai-zero-server-privacy-2026',
  'post-24': 'svg-png-webp-avif-300dpi-pdf-file-conversion-field-guide-2026',
  'post-25': 'gs1-sunrise-2027-digital-link-2d-qr-codes-retail-barcodes',
  'post-26': 'quishing-qr-code-phishing-scams-parking-meter-security-guide',
  'post-27': 'google-review-qr-code-triple-5-star-ratings-local-seo-2026',
  'post-28': 'offline-zero-signal-qr-codes-wifi-vcard-ical-no-internet',
  'post-29': 'why-qr-code-wont-scan-print-ink-contrast-troubleshooting',
  'post-30': 'free-qr-code-expired-how-to-decode-rescue-rebuild-forever',
  'post-31': 'whatsapp-direct-chat-qr-code-generator-prefilled-message-guide',
  'post-32': 'multi-link-tree-bio-qr-code-generator-creators-business-cards',
  'post-33': 'app-store-play-store-qr-code-generator-mobile-app-installs',
  'post-34': 'pdf-to-qr-code-generator-permanent-manuals-menus-brochures',
  'post-35': 'calendar-event-ical-qr-code-generator-events-weddings-webinars',
  'post-36': 'google-maps-gps-location-qr-code-generator-directions-guide',
  'post-37': 'instagram-profile-qr-code-generator-branded-logo-salon-packaging',
  'post-38': 'discount-coupon-promo-qr-code-generator-receipts-unboxing-mailers',
  'post-39': 'appointment-booking-calendly-qr-code-generator-salons-clinics',
  'post-40': 'short-link-redirect-qr-code-generator-low-density-tiny-prints',
  'post-41': 'wifi-qr-code-generator-instant-guest-network-login-cafes-airbnb',
  'post-42': 'vcard-3-digital-business-card-qr-code-generator-networking-guide',
  'post-43': 'restaurant-digital-menu-qr-code-generator-tables-bars-allergens',
  'post-44': 'youtube-video-qr-code-generator-unboxing-tutorials-museums',
  'post-45': 'tiktok-profile-challenge-qr-code-generator-retail-events',
  'post-46': 'linkedin-profile-company-qr-code-generator-conferences-keynotes',
  'post-47': 'real-estate-property-tour-qr-code-generator-yard-signs-flyers',
  'post-48': 'hotel-check-in-concierge-guide-qr-code-generator-guest-rooms',
  'post-49': 'wedding-rsvp-registry-qr-code-generator-invitations-photos',
  'post-50': 'paypal-instant-pay-qr-code-generator-markets-freelancers-salons',
  'post-51': 'free-website-url-qr-code-generator-utm-attribution-print-svg',
  'post-52': 'dynamic-landing-page-qr-code-generator-campaign-attribution-waitlists',
  'post-53': 'direct-email-mailto-qr-code-generator-support-warranty-b2b-quotes',
  'post-54': 'sms-text-message-qr-code-generator-vip-optins-contests-retail',
  'post-55': 'one-tap-phone-call-tel-qr-code-generator-emergency-service-clinics',
  'post-56': 'spotify-song-playlist-qr-code-generator-vinyl-cafes-merch',
  'post-57': 'discord-server-invite-qr-code-generator-esports-creators-hackathons',
  'post-58': 'github-repository-release-qr-code-generator-talks-hackathons-swag',
  'post-59': 'two-factor-authentication-totp-qr-code-generator-airgapped-devops',
  'post-60': 'zoom-meeting-quick-join-qr-code-generator-boardrooms-hybrid-campus',
  'post-61': 'feedback-survey-form-qr-code-generator-hotels-clinics-cafes',
  'post-62': 'portfolio-resume-link-qr-code-generator-architects-designers-cvs',
  'post-63': 'browser-bookmark-qr-code-generator-docs-syllabi-recipes',
  'post-64': 'facebook-page-group-qr-code-generator-local-stores-community-events',
  'post-65': 'telegram-channel-chat-qr-code-generator-meetups-alerts-creators',
  'post-66': 'inventory-sku-product-batch-qr-code-generator-warehouse-logistics',
  'post-67': 'job-posting-careers-qr-code-generator-storefronts-career-fairs',
  'post-68': 'wireguard-vpn-config-qr-code-generator-zero-knowledge-onboarding',
  'post-69': 'upi-quick-pay-india-qr-code-generator-gpay-phonepe-paytm',
  'post-70': 'bitcoin-wallet-payment-qr-code-generator-bip21-pos-invoices',
  'post-71': 'google-reviews-booster-qr-code-generator-counters-receipts-vans',
  'post-72': 'business-profile-hub-qr-code-generator-storefronts-reception-doors',
  'post-73': 'slide-deck-pitch-deck-qr-code-generator-keynotes-boardrooms',
  'post-74': 'google-meet-direct-join-qr-code-generator-huddle-rooms-campus',
  'post-75': 'sepa-epc-bank-transfer-eur-qr-code-generator-girocode-invoices',
  'post-76': 'pix-instant-payment-br-code-qr-code-generator-brazil-counters',
  'post-77': 'venmo-payment-handle-qr-code-generator-markets-salons-tips',
  'post-78': 'cash-app-cashtag-qr-code-generator-barbershops-merch-tables',
  'post-79': 'vacation-rental-welcome-rules-qr-code-generator-airbnb-vrbo',
  'post-80': 'podcast-show-episode-qr-code-generator-books-studios-events',
  'post-81': 'calendly-1-on-1-scheduling-booking-link-qr-code-generator',
  'post-82': 'pinterest-board-idea-pin-qr-code-generator-showrooms-bridal',
  'post-83': 'photo-gallery-album-qr-code-generator-weddings-exhibitions-tours',
  'post-84': 'ebook-epub-reader-qr-code-generator-bookstores-authors-libraries',
  'post-85': 'twitch-live-channel-qr-code-generator-gaming-expos-creators',
  'post-86': 'audio-stream-mp3-qr-code-generator-museums-gardens-books',
  'post-87': 'plain-text-offline-note-qr-code-generator-machinery-archives',
  'post-88': 'x-twitter-profile-prefilled-post-qr-code-generator-events-media',
  'post-89': 'ethereum-erc20-eip681-payment-qr-code-generator-galleries-freelancers',
  'post-90': 'matter-smart-home-setup-code-qr-generator-switches-binders',
  'post-91': 'video-stream-vimeo-cloud-qr-code-generator-unboxing-luxury',
  'post-92': 'clipboard-copy-action-qr-code-generator-license-keys-promos',
  'post-93': 'flight-boarding-pass-roster-qr-code-generator-charters-tours',
  'post-94': 'solana-wallet-sol-usdc-payment-qr-code-generator-retail-popups',
  'post-95': 'ssh-server-connection-uri-qr-code-generator-racks-homelabs',
  'post-96': 'docker-container-registry-qr-code-generator-workshops-devops',
  'post-97': 'rss-atom-news-feed-qr-code-generator-zines-changelogs',
  'post-98': 'threads-profile-post-qr-code-generator-events-creators',
  'post-99': 'facetime-video-call-qr-code-generator-concierge-family-support',
  'post-100': 'skype-call-chat-qr-code-generator-global-consulting-desks',
  'post-101': 'viber-chat-call-qr-code-generator-courier-hospitality-support',
  'post-102': 'mecard-compact-contact-qr-code-generator-tiny-badges-stamps',
  'post-103': 'batch-csv-bulk-qr-code-generator-inventory-badges-zip-export',
  'post-104': 'branded-qr-code-customizer-logos-gradients-contrast-guide',
  'post-105': 'qr-code-print-size-calculator-10-to-1-distance-300-dpi-guide',
  'post-106': 'qr-code-hospitality-funnel-menus-wifi-google-reviews-guide',
  'post-107': 'developer-devops-qr-provisioning-totp-wireguard-ssh-docker',
  'post-108': 'ugc-promo-video-qr-code-studio-reels-tiktok-shorts-guide',
  'post-109': 'calendly-qr-code-generator-business-cards-clinics-consultants',
  'post-110': 'thermal-receipt-shipping-label-qr-codes-203-dpi-pos-guide',
  'post-111': 'qr-codes-vs-nfc-tags-cost-compatibility-hybrid-signage-guide',
  'post-112': 'healthcare-clinic-patient-intake-pharmacy-pdf-qr-code-guide',
  'post-113': 'trade-show-booth-lead-capture-qr-kit-exhibitor-badges-guide',
  'post-114': 'osha-sds-chemical-binder-heavy-equipment-inspection-qr-tags',
  'post-115': 'museum-art-gallery-botanical-trail-audio-tour-qr-code-guide',
  'post-116': 'classroom-university-syllabus-parent-night-qr-code-toolkit',
  'post-117': 'nonprofit-charity-gala-church-zero-fee-donation-qr-code-guide',
};

const VALID_POST_SLUGS = new Set(Object.values(POST_ID_SLUGS));

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .map((word) => {
      if (word === 'qr') return 'QR';
      if (word === '2d') return '2D';
      if (word === '3d') return '3D';
      if (word === 'ai') return 'AI';
      if (word === 'gs1') return 'GS1';
      if (word === 'dpi') return 'DPI';
      if (word === 'csv') return 'CSV';
      if (word === 'svg') return 'SVG';
      if (word === 'png') return 'PNG';
      if (word === 'pdf') return 'PDF';
      if (word === 'wifi') return 'Wi-Fi';
      if (word === 'nfc') return 'NFC';
      if (word === 'osha') return 'OSHA';
      if (word === 'ugc') return 'UGC';
      if (word === 'pos') return 'POS';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function resolveRouteMeta(query) {
  const view = typeof query.view === 'string' ? query.view.toLowerCase().trim() : '';
  const postRaw = typeof query.post === 'string' ? query.post.trim() : '';
  const toolRaw = typeof query.tool === 'string' ? query.tool.toLowerCase().trim() : '';
  const hasQuerySearch = typeof query.q === 'string' && query.q.trim().length > 0;
  const hasSharedCfg = typeof query.cfg === 'string' && query.cfg.trim().length > 0;

  if (view) {
    if (view === 'directory') {
      return { ...VIEW_META.directory, robots: INDEX_ROBOTS };
    }
    if (view === 'blog') {
      if (postRaw) {
        const canonicalSlug = LEGACY_SLUGS[postRaw] || POST_ID_SLUGS[postRaw] || postRaw;
        if (VALID_POST_SLUGS.has(canonicalSlug)) {
          const readableTitle = slugToTitle(canonicalSlug);
          return {
            title: `${readableTitle} | 2qrcode.com Engineering Guide`,
            description: `Field-tested E-E-A-T engineering guide on ${readableTitle} by Afzal Naveed—ISO/IEC 18004 print math, static QR best practices, and troubleshooting.`,
            canonical: `https://2qrcode.com/?view=blog&post=${canonicalSlug}`,
            robots: INDEX_ROBOTS,
          };
        }
        return {
          title: 'Article Not Found | 2qrcode.com',
          description: VIEW_META.blog.description,
          canonical: `https://2qrcode.com/?view=blog&post=${encodeURIComponent(postRaw)}`,
          robots: 'noindex, follow',
        };
      }
      return {
        ...VIEW_META.blog,
        robots: hasQuerySearch ? 'noindex, follow' : INDEX_ROBOTS,
      };
    }
    if (VIEW_META[view]) {
      return { ...VIEW_META[view], robots: INDEX_ROBOTS };
    }
    return {
      title: 'Page Not Found | 2qrcode.com',
      description: VIEW_META.directory.description,
      canonical: `https://2qrcode.com/?view=${encodeURIComponent(view)}`,
      robots: 'noindex, follow',
    };
  }

  if (toolRaw) {
    const label = TOOL_LABELS[toolRaw];
    if (label) {
      return {
        title: `${label} QR Code Generator (Free, Static & No Expiry) | 2qrcode.com`,
        description: `Generate a permanent, zero-tracking ${label} QR code for free with custom logos, colors, frames, and 300 DPI SVG/PNG export on 2qrcode.com.`,
        canonical: `https://2qrcode.com/?tool=${toolRaw}`,
        robots: hasSharedCfg ? 'noindex, follow' : INDEX_ROBOTS,
      };
    }
    return {
      title: 'QR Generator Not Found | 2qrcode.com',
      description: VIEW_META.directory.description,
      canonical: `https://2qrcode.com/?tool=${encodeURIComponent(toolRaw)}`,
      robots: 'noindex, follow',
    };
  }

  if (hasQuerySearch) {
    return { ...VIEW_META.blog, robots: 'noindex, follow' };
  }

  return { ...VIEW_META.directory, robots: INDEX_ROBOTS };
}

let cachedHtmlTemplate = null;
function getHtmlTemplate() {
  if (!cachedHtmlTemplate) {
    cachedHtmlTemplate = fs.readFileSync(distIndex, 'utf-8');
  }
  return cachedHtmlTemplate;
}

function renderHtmlWithMeta(meta) {
  let html = getHtmlTemplate();
  const safeTitle = escapeHtmlAttr(meta.title);
  const safeDesc = escapeHtmlAttr(meta.description);
  const safeCanon = escapeHtmlAttr(meta.canonical);
  const safeRobots = escapeHtmlAttr(meta.robots);

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  html = html.replace(
    /<meta id="robots-meta"[^>]*>/i,
    `<meta id="robots-meta" name="robots" content="${safeRobots}" />`
  );
  html = html.replace(
    /<link id="canonical-link"[^>]*>/i,
    `<link id="canonical-link" rel="canonical" href="${safeCanon}" />`
  );
  html = html.replace(
    /<meta name="description"[^>]*>/i,
    `<meta name="description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta id="og-url-meta"[^>]*>/i,
    `<meta id="og-url-meta" property="og:url" content="${safeCanon}" />`
  );
  html = html.replace(
    /<meta property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );
  return html;
}

// Redirect /index.html cleanly to /
app.get('/index.html', (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(301, `/${qs}`);
});

// 301 Redirect clean vanity paths to canonical query routes
const vanityRedirects = {
  '/blog': '/?view=blog',
  '/batch': '/?view=batch',
  '/customizer': '/?view=customizer',
  '/converter': '/?view=converter',
  '/agent': '/?view=agent',
  '/about': '/?view=about',
  '/faq': '/?view=faqs',
  '/faqs': '/?view=faqs',
  '/reviews': '/?view=reviews',
  '/contact': '/?view=contact',
  '/privacy': '/?view=privacy',
  '/privacy-policy': '/?view=privacy',
  '/cookies': '/?view=cookies',
  '/cookies-policy': '/?view=cookies',
  '/terms': '/?view=terms',
  '/terms-of-service': '/?view=terms',
  '/video': '/?view=video',
};

app.use((req, res, next) => {
  const cleanPath = req.path.length > 1 && req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
  const target = vanityRedirects[cleanPath.toLowerCase()];
  if (target) {
    res.redirect(301, target);
    return;
  }
  next();
});

// Serve content-hashed Vite bundles with long-term immutable caching
app.use(
  '/assets',
  express.static(path.join(distDir, 'assets'), {
    maxAge: '1y',
    immutable: true,
  })
);

// Serve static public files (ads.txt, robots.txt, sitemap.xml, llms.txt, favicon.svg, audio/, video/)
// index: false ensures GET / always reaches the dynamic SSR metadata handler below
app.use(
  express.static(distDir, {
    index: false,
    setHeaders(res, filePath) {
      if (
        filePath.endsWith('.html') ||
        filePath.endsWith('ads.txt') ||
        filePath.endsWith('robots.txt') ||
        filePath.endsWith('sitemap.xml') ||
        filePath.endsWith('llms.txt')
      ) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      }
    },
  })
);

// Dedicated video studio HTML entrypoint
app.get('/video.html', (_req, res) => {
  res.sendFile(path.join(distDir, 'video.html'));
});

// Root SPA entry with HTTP 200 and route-accurate SSR metadata for all search engine crawlers
app.get('/', (req, res) => {
  const meta = resolveRouteMeta(req.query);
  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.send(renderHtmlWithMeta(meta));
});

// Return true HTTP 404 for unknown paths (avoiding Soft-404 / duplicate canonicals)
app.use((req, res) => {
  if (/\.(js|css|map|png|jpg|jpeg|webp|svg|ico|woff2|mp4|mp3)$/i.test(req.path)) {
    res.status(404).end('Not found');
    return;
  }
  const notFoundPage = path.join(distDir, '404.html');
  res.status(404);
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(fs.existsSync(notFoundPage) ? notFoundPage : distIndex);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[2qrcode.com] Production server running on http://0.0.0.0:${port}`);
});
