import { QRGeneratorTool } from '../types/qr';

export const EXTRA_QR_GENERATORS: QRGeneratorTool[] = [
  {
    id: 'sepa',
    name: 'SEPA EPC Bank Transfer (EUR)',
    category: 'finance',
    iconName: 'Banknote',
    badge: 'EPC QR',
    shortDescription: 'Generate official European Payments Council (GiroCode) bank transfer QR codes in Euros.',
    detailedDescription:
      'Follows the EPC069-12 standard used by banking apps across Germany, Austria, Belgium, Finland, and the Netherlands to pre-fill IBAN, BIC, recipient, amount, and invoice reference.',
    rating: 4.9,
    ratingCount: 3180,
    fields: [
      { id: 'name', label: 'Beneficiary Name', type: 'text', defaultValue: 'Nordic Print GmbH', required: true },
      { id: 'iban', label: 'IBAN Account Number', type: 'text', defaultValue: 'DE89370400440532013000', required: true },
      { id: 'bic', label: 'BIC / SWIFT (Optional)', type: 'text', defaultValue: 'COBADEFFXXX' },
      { id: 'amount', label: 'Amount in EUR (Optional)', type: 'text', placeholder: '149.50', defaultValue: '149.50' },
      { id: 'reference', label: 'Invoice / Remittance Purpose', type: 'text', defaultValue: 'INV-2026-8841' },
    ],
    defaultValues: {
      name: 'Nordic Print GmbH',
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      amount: '149.50',
      reference: 'INV-2026-8841',
    },
    defaultPayloadGenerator: (v) => {
      const cleanIban = String(v.iban || '').replace(/\s+/g, '').toUpperCase();
      const cleanBic = String(v.bic || '').replace(/\s+/g, '').toUpperCase();
      const cleanName = String(v.name || '').trim().slice(0, 70);
      const amtNum = parseFloat(String(v.amount || '').replace(',', '.'));
      const amountLine = !Number.isNaN(amtNum) && amtNum > 0 ? `EUR${amtNum.toFixed(2)}` : '';
      const purpose = String(v.reference || '').trim().slice(0, 140);
      return [
        'BCD',
        '002',
        '1',
        'SCT',
        cleanBic,
        cleanName,
        cleanIban,
        amountLine,
        '',
        '',
        purpose,
        '',
      ].join('\n');
    },
    guide: {
      wayToUse: 'Print on European PDF invoices, charity flyers, and membership renewal letters so payers scan straight inside their mobile banking app with zero IBAN typing errors.',
      whereToUse: ['Printed B2B & freelancer invoices', 'Non-profit donation postcards', 'Club dues & utility bills'],
      howToUse: ['Enter exact payee name and IBAN', 'Optionally specify EUR amount and invoice reference', 'Place clean black-on-white vector SVG in bottom invoice corner'],
      whoCanProfit: [{ role: 'European Freelancers & Agencies', benefit: 'Dramatically reduces overdue invoices caused by typos when customers manually copy 22-character IBANs.' }],
      faqs: [
        { question: 'Which banks support EPC SEPA QR codes?', answer: 'Nearly all major mobile banking apps in Germany, Austria, Belgium, Finland, Slovakia, and the Netherlands natively decode EPC069-12 QR codes.' },
        { question: 'Are there processing fees on SEPA QR payments?', answer: 'Zero gateway markups—transfers settle over standard Euro SEPA credit transfer rails directly into your IBAN.' },
      ],
    },
  },
  {
    id: 'pix',
    name: 'PIX Instant Payment Link / Key',
    category: 'finance',
    iconName: 'Zap',
    badge: 'Instant',
    shortDescription: 'Share Brazilian PIX Copia e Cola payloads or merchant checkout links seamlessly.',
    detailedDescription:
      'Encode your PIX EMVCo BR Code string directly as a crisp high-contrast vector square for retail counters, delivery bags, and digital receipts.',
    rating: 4.9,
    ratingCount: 2740,
    fields: [
      { id: 'payload', label: 'PIX Payload String or Checkout URL', type: 'textarea', defaultValue: '00020126360014br.gov.bcb.pix0114+55119999988885204000053039865802BR5913Cafe Paulista6009Sao Paulo62070503***63041D3D', required: true, helperText: 'Paste your official PIX BR Code or Copia e Cola string' },
    ],
    defaultValues: {
      payload: '00020126360014br.gov.bcb.pix0114+55119999988885204000053039865802BR5913Cafe Paulista6009Sao Paulo62070503***63041D3D',
    },
    defaultPayloadGenerator: (v) => String(v.payload || '').trim(),
    guide: {
      wayToUse: 'Turn any bank-issued PIX Copia e Cola string into a sharp branded counter plaque with a custom CTA frame.',
      whereToUse: ['Cafe register displays', 'Delivery parcel stickers', 'Market vendor lanyards'],
      howToUse: ['Copy your official PIX EMV string from your bank app', 'Customize frame copy cleanly', 'Print at 35mm+ size for rapid low-light checkout scanning'],
      whoCanProfit: [{ role: 'Brazilian Merchants & Service Pros', benefit: 'Print durable counter placards matching your brand colors without faded thermal receipt slips.' }],
      faqs: [{ question: 'Should I set Error Correction to High when adding a logo over PIX QR?', answer: 'Yes—always use Level H when embedding a store icon so scanners read all EMV payment tags in under a second.' }],
    },
  },
  {
    id: 'podcast',
    name: 'Podcast Show & Episode Link',
    category: 'media',
    iconName: 'Music2',
    badge: 'Audio',
    shortDescription: 'Drive conference listeners and print readers straight to your podcast show or episode.',
    detailedDescription:
      'Connects print magazine interviews, book jackets, and live event slides directly to Spotify, Apple Podcasts, or your web player.',
    rating: 4.8,
    ratingCount: 1690,
    fields: [
      { id: 'url', label: 'Podcast Show or Episode URL', type: 'url', defaultValue: 'https://podcasts.apple.com/us/podcast/id123456789', required: true },
    ],
    defaultValues: { url: 'https://podcasts.apple.com/us/podcast/id123456789' },
    defaultPayloadGenerator: (v) => {
      const u = String(v.url || '').trim();
      return u.startsWith('http') ? u : `https://${u}`;
    },
    guide: {
      wayToUse: 'Place beside printed speaker bios, newsletter handouts, and coffee-shop community boards so commuters subscribe mid-walk.',
      whereToUse: ['Book back covers', 'Conference speaker name badges', 'Merchandise T-shirt hangtags'],
      howToUse: ['Paste your smart podcast show link', 'Add "Listen Now" bottom frame', 'Export high-res SVG for print'],
      whoCanProfit: [{ role: 'Independent Creators & Authors', benefit: 'Converts offline readers and live audience attendees directly into repeat podcast subscribers.' }],
      faqs: [{ question: 'Can I link one universal podcast page for iOS and Android listeners?', answer: 'Yes—linking your web player or multi-platform show page lets every listener open their preferred player.' }],
    },
  },
  {
    id: 'twitch',
    name: 'Twitch Live Channel',
    category: 'social',
    iconName: 'Tv',
    badge: 'Live',
    shortDescription: 'Bring gaming convention visitors and VOD viewers straight to your Twitch stream.',
    detailedDescription:
      'Clean direct link generator for live creators sharing channel handles on cosplay cards, booth banners, and PC hardware showcases.',
    rating: 4.8,
    ratingCount: 1840,
    fields: [
      { id: 'channel', label: 'Twitch Channel Handle', type: 'text', defaultValue: 'esports_arena_live', required: true, helperText: 'Enter channel name without full URL' },
    ],
    defaultValues: { channel: 'esports_arena_live' },
    defaultPayloadGenerator: (v) => `https://www.twitch.tv/${String(v.channel || '').trim().replace(/^@/, '')}`,
    guide: {
      wayToUse: 'Print on gaming booth banners, monitor frame stickers, and LAN party merch drops.',
      whereToUse: ['Gaming expo booths', 'Stream overlay corner badges', 'Custom keyboard deskmats'],
      howToUse: ['Enter Twitch handle', 'Choose high-contrast violet/amber styling', 'Keep quiet zone clear on curved hardware surfaces'],
      whoCanProfit: [{ role: 'Streamers & Esports Teams', benefit: 'Turns live arena spectators into instant Twitch followers before leaving your booth.' }],
      faqs: [{ question: 'Does scanning launch the Twitch mobile app automatically?', answer: 'On phones with Twitch installed, universal HTTPS channel URLs trigger direct in-app routing.' }],
    },
  },
  {
    id: 'pinterest',
    name: 'Pinterest Board & Idea Pin',
    category: 'social',
    iconName: 'Bookmark',
    shortDescription: 'Connect physical showroom displays and wedding expos to visual Pinterest inspiration boards.',
    detailedDescription:
      'Ideal for interior designers, florists, tile showrooms, and DIY craft brands pairing tactile samples with digital lookbooks.',
    rating: 4.7,
    ratingCount: 1320,
    fields: [
      { id: 'boardUrl', label: 'Pinterest Profile or Board URL', type: 'url', defaultValue: 'https://www.pinterest.com/studio_minimal/2026-interiors/', required: true },
    ],
    defaultValues: { boardUrl: 'https://www.pinterest.com/studio_minimal/2026-interiors/' },
    defaultPayloadGenerator: (v) => {
      const u = String(v.boardUrl || '').trim();
      return u.startsWith('http') ? u : `https://${u}`;
    },
    guide: {
      wayToUse: 'Attach small studio labels onto ceramic swatches, fabric sample books, and bridal expo booths so visitors save complete room boards.',
      whereToUse: ['Interior material sample boards', 'Bridal & floral expos', 'Hardware store paint displays'],
      howToUse: ['Copy your public Pinterest board URL', 'Style in warm brand palette', 'Print crisp 25mm swatch tags'],
      whoCanProfit: [{ role: 'Interior Designers & Craft Studios', benefit: 'Lets showroom visitors save whole curated mood boards in one camera glance.' }],
      faqs: [{ question: 'Do visitors need a Pinterest account to view a public board?', answer: 'Anyone can preview public Pinterest pins cleanly in their mobile browser.' }],
    },
  },
  {
    id: 'calendly',
    name: '1-on-1 Scheduling & Booking Link',
    category: 'communication',
    iconName: 'CalendarCheck',
    badge: 'Booking',
    shortDescription: 'Let prospects scan and reserve 15-minute discovery calls or clinic consultations instantly.',
    detailedDescription:
      'Supports Calendly, Cal.com, Google Appointment Schedules, or TidyCal links on business cards, storefront doors, and webinar closing slides.',
    rating: 4.9,
    ratingCount: 2890,
    fields: [
      { id: 'bookingUrl', label: 'Scheduling Page URL', type: 'url', defaultValue: 'https://cal.com/afzal-naveed/30min', required: true },
    ],
    defaultValues: { bookingUrl: 'https://cal.com/afzal-naveed/30min' },
    defaultPayloadGenerator: (v) => {
      const u = String(v.bookingUrl || '').trim();
      return u.startsWith('http') ? u : `https://${u}`;
    },
    guide: {
      wayToUse: 'Eliminate back-and-forth "what time works for you?" emails by printing a direct booking link on booth signage and closing deck slides.',
      whereToUse: ['Executive business cards', 'Trade show booth backdrops', 'Closed-office front doors after hours'],
      howToUse: ['Paste your Cal.com or Calendly link', 'Pair with "Book 15m Demo" CTA frame', 'Download high-contrast vector SVG'],
      whoCanProfit: [{ role: 'B2B Consultants & Realtors', benefit: 'Captures hot inbound leads immediately while talking at networking events.' }],
      faqs: [{ question: 'Which booking platforms work with this QR code?', answer: 'Cal.com, Calendly, Google Calendar appointment links, HubSpot Meetings, and Acuity all work out of the box.' }],
    },
  },
  {
    id: 'airbnb',
    name: 'Vacation Rental Welcome & Rules',
    category: 'business',
    iconName: 'Key',
    badge: 'Hosting',
    shortDescription: 'Share digital check-in instructions, appliance guides, and neighborhood picks with rental guests.',
    detailedDescription:
      'Replaces worn three-ring binders on kitchen islands with one scannable framed placard linking directly to your live guest handbook.',
    rating: 4.9,
    ratingCount: 2510,
    fields: [
      { id: 'guideUrl', label: 'Digital House Manual or Listing URL', type: 'url', defaultValue: 'https://guide.example-stays.com/loft-402', required: true },
    ],
    defaultValues: { guideUrl: 'https://guide.example-stays.com/loft-402' },
    defaultPayloadGenerator: (v) => {
      const u = String(v.guideUrl || '').trim();
      return u.startsWith('http') ? u : `https://${u}`;
    },
    guide: {
      wayToUse: 'Frame inside an acrylic block beside front entry keys and pair with a separate Wi-Fi QR card for instant zero-call guest arrivals.',
      whereToUse: ['Airbnb & VRBO entry tables', 'Boutique guesthouse nightstands', 'Co-living kitchen counters'],
      howToUse: ['Paste your live guest guide link', 'Label cleanly "House Guide & Check-Out"', 'Place on welcome counter'],
      whoCanProfit: [{ role: 'Short-Term Rental Hosts', benefit: 'Cuts late-night guest questions about thermostat controls, trash days, and parking permits.' }],
      faqs: [{ question: 'Can I update house rules later without reprinting the plaque?', answer: 'Yes—as long as your guide web page URL stays the same, updating rules online updates what every future guest sees.' }],
    },
  },
  {
    id: 'matter',
    name: 'Matter / IoT Smart Home Setup Code',
    category: 'tech',
    iconName: 'Home',
    badge: 'IoT',
    shortDescription: 'Recreate fading smart-home Matter (MT:) setup stickers for bulbs, locks, and thermostats.',
    detailedDescription:
      'Preserves official Matter commissioning payloads safely inside laminated binder backups so you never lose device pairing when tiny underside stickers peel off.',
    rating: 4.8,
    ratingCount: 1190,
    fields: [
      { id: 'payload', label: 'Matter Commissioning Code (MT:...)', type: 'text', defaultValue: 'MT:Y.K9042C00KA0648G00', required: true, helperText: 'Standard Matter onboarding payload beginning with MT:' },
    ],
    defaultValues: { payload: 'MT:Y.K9042C00KA0648G00' },
    defaultPayloadGenerator: (v) => String(v.payload || '').trim(),
    guide: {
      wayToUse: 'Back up tiny peeling Matter QR codes located behind recessed smart switches or attic hubs into a clean breaker-panel reference sheet.',
      whereToUse: ['Smart home breaker cabinet index', 'Electrician handover binders', 'Property hardware archives'],
      howToUse: ['Copy the exact MT: commissioning string from device box before mounting', 'Print compact label with high contrast', 'Test scan cleanly with Apple Home or Google Home'],
      whoCanProfit: [{ role: 'Smart Home Installers & Electricians', benefit: 'Hands property owners a durable pairing directory even when hardware devices sit inside ceiling fixtures.' }],
      faqs: [{ question: 'Does this modify or store my home pairing code?', answer: 'Never—all generation executes 100% locally in your browser memory without transmitting MT payloads anywhere.' }],
    },
  },
  {
    id: 'docker',
    name: 'Docker & Container Image Registry',
    category: 'tech',
    iconName: 'Layers',
    badge: 'DevOps',
    shortDescription: 'Link slide decks, workstation stickers, and docs straight to Docker Hub or GHCR packages.',
    detailedDescription:
      'Enables engineering teams and developer advocates to share reproducible container releases at technical meetups without manual URL spelling.',
    rating: 4.8,
    ratingCount: 1410,
    fields: [
      { id: 'imagePath', label: 'Docker Hub or Registry URL', type: 'url', defaultValue: 'https://hub.docker.com/r/library/nginx', required: true },
    ],
    defaultValues: { imagePath: 'https://hub.docker.com/r/library/nginx' },
    defaultPayloadGenerator: (v) => {
      const u = String(v.imagePath || '').trim();
      return u.startsWith('http') ? u : `https://${u}`;
    },
    guide: {
      wayToUse: 'Place on workshop handouts, hackathon table cards, and lab server racks for immediate documentation lookup.',
      whereToUse: ['DevOps conference slides', 'Homelab chassis labels', 'Onboarding engineering handbooks'],
      howToUse: ['Paste public Docker Hub, Quay, or GHCR image page', 'Keep foreground dots high-contrast black/slate', 'Export vector SVG into slides'],
      whoCanProfit: [{ role: 'Developer Advocates & SRE Teams', benefit: 'Eliminates audience typos when attendees try pulling live workshop container stacks.' }],
      faqs: [{ question: 'Can I point directly to GitHub Container Registry packages?', answer: 'Yes—any full `https://` registry URL (Docker Hub, ghcr.io, Quay) scans cleanly.' }],
    },
  },
  {
    id: 'rss',
    name: 'RSS / Atom News & Blog Feed',
    category: 'web',
    iconName: 'Link',
    badge: 'Publishing',
    shortDescription: 'Promote independent journalism, changelogs, and open RSS feeds outside closed social algorithms.',
    detailedDescription:
      'Directs readers straight to XML/Atom syndication feeds or feed landing pages from printed zines, conference flyers, and indie magazines.',
    rating: 4.7,
    ratingCount: 1120,
    fields: [
      { id: 'feedUrl', label: 'RSS / Atom Feed URL', type: 'url', defaultValue: 'https://2qrcode.com/sitemap.xml', required: true },
    ],
    defaultValues: { feedUrl: 'https://2qrcode.com/sitemap.xml' },
    defaultPayloadGenerator: (v) => {
      const u = String(v.feedUrl || '').trim();
      return u.startsWith('http') ? u : `https://${u}`;
    },
    guide: {
      wayToUse: 'Print inside independent newsletters, library bulletin boards, and developer changelogs to connect offline readers straight into RSS feed readers.',
      whereToUse: ['Independent print zines', 'University lab posters', 'Release notes cards'],
      howToUse: ['Paste your site RSS or Atom feed URL', 'Add a clean "Follow RSS Feed" tag frame', 'Print with a minimum 4-module white margin'],
      whoCanProfit: [{ role: 'Independent Journalists & Bloggers', benefit: 'Captures loyal direct subscribers who follow via Feedly, NetNewsWire, or Inoreader.' }],
      faqs: [{ question: 'Should I use high or medium contrast for small zine corners?', answer: 'Use crisp dark-on-light foreground/background contrast (>= 4:1) and at least 22mm print width for fast focus lock.' }],
    },
  },
];
