import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Basic concepts' | 'Design & creation' | 'Scanning & printing';
}

const FAQS: FAQItem[] = [
  // 1. Basic concepts
  {
    category: 'Basic concepts',
    question: 'What is a QR code generator?',
    answer:
      'A QR code generator is a software tool that allows you to encode digital data—such as website links, Wi-Fi network credentials, digital business cards (vCard), or payment strings—into a two-dimensional matrix of black and gold/white squares. Anyone with a smartphone camera can point at the code to trigger immediate actions without typing.',
  },
  {
    category: 'Basic concepts',
    question: 'How do I download my QR code?',
    answer:
      'You can export your completed QR code at any time with one click as a high-resolution PNG, JPG, or scalable vector SVG. No account or email registration is required.',
  },
  {
    category: 'Basic concepts',
    question: 'Can anyone create a QR code?',
    answer:
      'Yes! Online QR Generator PRO is engineered for complete beginners and professional designers alike. Simply choose your desired content type, fill in the simple form fields, customize your colors or logo, and download.',
  },
  {
    category: 'Basic concepts',
    question: 'Why are there other websites offering QR code generators for "free" then charging?',
    answer:
      'Many competitor sites use a bait-and-switch subscription model. They route your scan through their private redirect servers and secretly disable your code after 14 days unless you pay $15-$30/month. At Online QR Generator PRO, all our static generators embed your data directly into the QR matrix itself. No middleman server, no expiration date, and 100% free forever.',
  },
  {
    category: 'Basic concepts',
    question: 'Can I use the QR codes generated here for commercial purposes?',
    answer:
      'Yes, 100%! All QR codes generated carry a full, perpetual, royalty-free commercial license. You can print them on commercial retail packaging, restaurant menus, corporate billboards, client invoices, and merchandise with zero restrictions.',
  },
  {
    category: 'Basic concepts',
    question: 'What kind of information can be stored in a QR code?',
    answer:
      'QR codes can store website URLs, Wi-Fi credentials, vCard contact files, calendar iCal appointments, direct email and SMS triggers, GPS coordinates, Bitcoin/Ethereum/Solana crypto addresses, and raw text notes.',
  },
  {
    category: 'Basic concepts',
    question: 'What is the difference between static and dynamic QR codes?',
    answer:
      'A static QR code contains the actual destination data directly encoded into its dot matrix. It works forever offline without relying on any external server. A dynamic QR code routes scans through a tracking redirection server. We recommend static QR codes because they never expire and protect user privacy.',
  },

  // 2. Design & creation
  {
    category: 'Design & creation',
    question: 'Can I customize my QR codes with different colors and styles?',
    answer:
      'Yes! In our Customizer Studio, you can adjust the foreground pattern color, background color, radiant linear gradients, dot geometries (classic square, rounded, circular dots, classy diamonds), corner eye frame styles, and eye pupil colors.',
  },
  {
    category: 'Design & creation',
    question: 'Is it possible to include my company’s logo or brand mark in the QR code?',
    answer:
      'Yes. You can choose from popular preset icons (Google, Apple, WhatsApp, Instagram, Wi-Fi, Bitcoin, etc.) or upload your own custom PNG/SVG logo. The studio automatically enables Reed-Solomon Error Correction Level H (30% data recovery) with a protective boundary mask to guarantee reliable scanning.',
  },
  {
    category: 'Design & creation',
    question: 'Is there a limit to how many QR codes I can create?',
    answer:
      'Zero limits! You can generate 1, 10, or 10,000 QR codes. Everything is compiled directly in your web browser with zero server throttles or paywalls.',
  },

  // 3. Scanning & printing
  {
    category: 'Scanning & printing',
    question: 'How do you scan a QR code?',
    answer:
      'Open the native Camera app on any modern iPhone, iPad, or Android phone. Hold the device steady with the QR code centered on the screen. A clickable notification banner will appear instantly at the bottom or top of the viewfinder.',
  },
  {
    category: 'Scanning & printing',
    question: 'How do I print my QR code without scan failures?',
    answer:
      'Always follow the 10:1 Distance Rule (calculate it in our Metric Print Converter). Ensure a minimum physical print width of 20mm (0.8 inches) for business cards, maintain high contrast between the pattern and background, and export in 300 DPI or vector SVG for professional print shops.',
  },
  {
    category: 'Scanning & printing',
    question: 'Do QR codes have a scan counter?',
    answer:
      'Because static QR codes encode data locally for total privacy, no central server logs user scans. If you want to track scan traffic for marketing campaigns, simply add standard UTM tracking tags (e.g. ?utm_source=flyer_print) in our generator, and Google Analytics will track visits for free.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Basic concepts', 'Design & creation', 'Scanning & printing'];

  const filtered = FAQS.filter(
    (faq) => selectedCat === 'All' || faq.category === selectedCat
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Frequently Asked <span className="text-gold-gradient">Questions</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Everything you need to know about QR generation, printing specs, and commercial rights.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCat(c)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedCat === c
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="bg-zinc-950/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl divide-y divide-zinc-800 backdrop-blur-xl">
        {filtered.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4.5 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-zinc-100 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed pr-6">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
