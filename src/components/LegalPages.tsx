import { useState } from 'react';
import { Shield, FileText, Mail, Check, ArrowLeft, Cookie } from 'lucide-react';

interface LegalPagesProps {
  page: 'privacy' | 'cookies' | 'terms' | 'contact';
  onNavigate: (view: string) => void;
}

export default function LegalPages({ page, onNavigate }: LegalPagesProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    const subject = encodeURIComponent(`[2qrcode.com] ${topic} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
    window.location.href = `mailto:contact@2qrcode.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Top Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#DFC7A0]">
        <button
          onClick={() => onNavigate('directory')}
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 2qrcode.com Generators</span>
        </button>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#FBF2E3] border border-[#E2CAA4] rounded-xl">
          {(
            [
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'cookies', label: 'Cookie & Ad Policy' },
              { id: 'terms', label: 'Terms & Disclaimer' },
              { id: 'contact', label: 'Contact Us' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                page === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-extrabold shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {page === 'privacy' && (
        <article className="p-8 sm:p-10 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl shadow-[0_12px_36px_-12px_rgba(120,82,25,0.14)] space-y-6 text-sm text-stone-700 leading-relaxed backdrop-blur-xl">
          <div className="space-y-2 pb-4 border-b border-[#E6D0AC]">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Shield className="w-4 h-4" />
              <span>2qrcode.com · Legal &amp; Data Protection</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900">Privacy Policy</h1>
            <p className="text-xs text-stone-600 font-mono">
              Effective Date: November 13, 2026 · Publisher: Afzal Naveed · https://2qrcode.com
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">1. Client-Side QR Generation &amp; Zero Payload Storage</h2>
            <p>
              At <strong>2qrcode.com</strong>, your privacy is built into our architecture. All 70+ individual QR generators and our Batch CSV QR Code Generator compile QR code matrices directly inside your local web browser using HTML5 Canvas and vector SVG. Website URLs, Wi-Fi network passwords, vCard contact details, 2FA TOTP secrets, cryptocurrency wallet addresses, and uploaded CSV spreadsheets are never uploaded to, logged on, or stored by our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">2. Google AdSense &amp; Third-Party Advertising Cookies</h2>
            <p>
              2qrcode.com uses <strong>Google AdSense</strong> (Publisher ID: <code className="px-1.5 py-0.5 bg-[#FBF2E3] rounded border border-[#E2CAA4] text-amber-900 font-mono text-xs">ca-pub-8358033803354457</code>) to serve advertisements and keep our 70+ QR generation tools and batch spreadsheet utilities 100% free without subscription fees.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
              </li>
              <li>
                Google&apos;s use of advertising cookies (including the DoubleClick DART cookie) enables it and its partners to serve ads to our visitors based on their visit to 2qrcode.com and other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising at any time by visiting{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline font-semibold hover:text-amber-950"
                >
                  Google Ads Settings (adssettings.google.com)
                </a>
                , reviewing{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline font-semibold hover:text-amber-950"
                >
                  Google Advertising Privacy &amp; Terms
                </a>
                , or opting out of third-party vendor cookies via{' '}
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline font-semibold hover:text-amber-950"
                >
                  Digital Advertising Alliance (aboutads.info)
                </a>{' '}
                and{' '}
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline font-semibold hover:text-amber-950"
                >
                  Network Advertising Initiative
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">3. Local Browser Preferences (localStorage)</h2>
            <p>
              We use standard browser <code className="px-1.5 py-0.5 bg-[#FBF2E3] rounded border border-[#E2CAA4] text-amber-900 font-mono text-xs">localStorage</code> solely to remember your chosen UI language (among our 16 supported languages), display tone, cookie consent choice, and any local tool ratings you submit. You may clear this data anytime via your browser settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">4. GDPR, CCPA/CPRA &amp; Children&apos;s Privacy (COPPA)</h2>
            <p>
              Visitors located in the European Economic Area (EEA), UK, or California retain full rights under GDPR and CCPA/CPRA to access, limit, or opt out of personalized advertising cookies (including California &ldquo;Do Not Sell or Share My Personal Information&rdquo; preferences via our Cookie Settings banner or{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 underline font-semibold hover:text-amber-950"
              >
                Google Ads Settings
              </a>
              ). 2qrcode.com does not knowingly collect personal information from children under 13 years of age in compliance with COPPA. Reach our publisher team at{' '}
              <button
                onClick={() => onNavigate('contact')}
                className="text-amber-800 underline font-semibold hover:text-amber-950 cursor-pointer"
              >
                contact@2qrcode.com
              </button>
              .
            </p>
          </section>
        </article>
      )}

      {page === 'cookies' && (
        <article className="p-8 sm:p-10 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl shadow-[0_12px_36px_-12px_rgba(120,82,25,0.14)] space-y-6 text-sm text-stone-700 leading-relaxed backdrop-blur-xl">
          <div className="space-y-2 pb-4 border-b border-[#E6D0AC]">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Cookie className="w-4 h-4" />
              <span>2qrcode.com · Cookie Policy &amp; Ad Disclosure</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900">Cookie &amp; Advertising Policy</h1>
            <p className="text-xs text-stone-600 font-mono">
              Updated: November 13, 2026 · AdSense ID: ca-pub-8358033803354457
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">1. What Cookies &amp; Storage We Use</h2>
            <p>
              2qrcode.com keeps core tool operation completely stateless on our servers. Browser storage is divided into two clear categories:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Essential Preferences:</strong> Stores your selected language, theme mode, and cookie consent choice in <code className="px-1.5 py-0.5 bg-[#FBF2E3] rounded border border-[#E2CAA4] text-amber-900 font-mono text-xs">localStorage</code> so the interface loads properly.
              </li>
              <li>
                <strong>Advertising &amp; Measurement Cookies (Google AdSense):</strong> Set by Google and certified ad partners to prevent ad fraud, cap frequency, measure performance, and—when consented—display relevant ads.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">2. Managing or Withdrawing Consent</h2>
            <p>
              You can switch between &ldquo;Accept All&rdquo; and &ldquo;Essential Only (Non-Personalized Ads)&rdquo; at any time by reopening our Cookie Settings dialog below or blocking third-party cookies in your browser preferences.
            </p>
            <div className="pt-2">
              <button
                onClick={() => window.dispatchEvent(new Event('2qrcode-open-cookie-settings'))}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 border border-amber-700/25 font-extrabold text-xs cursor-pointer transition-colors"
              >
                Open Cookie Preferences
              </button>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">3. Authorized Digital Sellers (ads.txt)</h2>
            <p>
              Our authorized Google AdSense seller record is publicly verifiable at{' '}
              <a
                href="/ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 underline font-mono font-semibold hover:text-amber-950"
              >
                https://2qrcode.com/ads.txt
              </a>{' '}
              (<code className="px-1.5 py-0.5 bg-[#FBF2E3] rounded border border-[#E2CAA4] text-amber-900 font-mono text-xs">google.com, pub-8358033803354457, DIRECT, f08c47fec0942fa0</code>).
            </p>
          </section>
        </article>
      )}

      {page === 'terms' && (
        <article className="p-8 sm:p-10 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl shadow-[0_12px_36px_-12px_rgba(120,82,25,0.14)] space-y-6 text-sm text-stone-700 leading-relaxed backdrop-blur-xl">
          <div className="space-y-2 pb-4 border-b border-[#E6D0AC]">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <FileText className="w-4 h-4" />
              <span>2qrcode.com · Platform Usage Agreement</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900">Terms of Service &amp; Disclaimer</h1>
            <p className="text-xs text-stone-600 font-mono">
              Last Updated: November 13, 2026 · Publisher: Afzal Naveed (2qrcode.com)
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">1. Perpetual Commercial License</h2>
            <p>
              All QR codes generated on <strong>2qrcode.com</strong>—including single static generators, customized logo QR designs, and bulk CSV batch exports—carry a 100% free, perpetual, worldwide commercial and personal license. You may print them on product packaging, restaurant menus, retail signs, and marketing brochures with zero royalties or scan limits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">2. Static Code Permanence</h2>
            <p>
              2qrcode.com generates direct static QR codes formatted to the ISO/IEC 18004 standard without proprietary middleman redirect servers. Because your destination data is written directly into the QR matrix, 2qrcode.com never expires, pauses, or throttles your printed codes. You remain solely responsible for maintaining the destination URLs, payment wallets, or Wi-Fi credentials encoded inside your QR codes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">3. Acceptable Use</h2>
            <p>
              You agree not to use 2qrcode.com to encode malicious phishing links, malware distribution URLs, fraudulent payment addresses, or unlawful content. Before mass printing any QR batch, users should test-scan generated codes on multiple smartphone devices under expected lighting and distance conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-900">4. Editorial Disclaimer &amp; Trademark Attribution</h2>
            <p>
              Editorial guides, print distance formulas, and software comparisons on 2qrcode.com are provided for informational and educational purposes &ldquo;as is&rdquo; without warranties of any kind. &ldquo;QR Code&rdquo; is a registered trademark of DENSO WAVE INCORPORATED.
            </p>
          </section>
        </article>
      )}

      {page === 'contact' && (
        <div className="p-8 sm:p-10 bg-[#FFFDF9]/92 border border-[#DFC7A0] rounded-3xl shadow-[0_12px_36px_-12px_rgba(120,82,25,0.14)] space-y-8 backdrop-blur-xl">
          <div className="space-y-2 pb-4 border-b border-[#E6D0AC]">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Mail className="w-4 h-4" />
              <span>2qrcode.com · Support &amp; Editorial Desk</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900">Contact 2qrcode.com</h1>
            <p className="text-sm text-stone-700">
              Have a question about bulk CSV generation, custom print sizing, editorial corrections, or advertising inquiries? Reach our team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4 text-xs text-stone-700">
              <div className="p-4 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl space-y-1.5">
                <div className="font-bold text-amber-900">Publisher &amp; Lead Architect</div>
                <div className="text-stone-900 font-semibold">Afzal Naveed</div>
                <div className="text-stone-600">2qrcode.com Engineering &amp; Editorial</div>
              </div>

              <div className="p-4 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl space-y-1.5">
                <div className="font-bold text-amber-900">Direct Email Channels</div>
                <div className="font-mono text-stone-900 font-medium">contact@2qrcode.com</div>
                <div className="font-mono text-stone-600">Afzal460@gmail.com</div>
              </div>

              <div className="p-4 bg-[#FBF2E3] border border-[#E2CAA4] rounded-2xl space-y-1.5">
                <div className="font-bold text-amber-900">Response Window</div>
                <p className="text-stone-700 leading-relaxed">
                  Editorial feedback, privacy requests, and enterprise CSV formatting questions are typically answered within 24–48 business hours.
                </p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-stone-800 mb-1.5">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D4B483] focus:border-amber-700 rounded-xl text-xs text-stone-900 placeholder:text-stone-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-stone-800 mb-1.5">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D4B483] focus:border-amber-700 rounded-xl text-xs text-stone-900 placeholder:text-stone-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-topic" className="block text-xs font-semibold text-stone-800 mb-1.5">Inquiry Topic</label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D4B483] focus:border-amber-700 rounded-xl text-xs text-stone-900 focus:outline-hidden"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Batch CSV Generator Support">Batch CSV Generator Support</option>
                  <option value="Editorial / Technical Correction">Editorial / Technical Correction</option>
                  <option value="Privacy / AdSense Compliance">Privacy / AdSense Compliance</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-stone-800 mb-1.5">Message</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or feedback..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D4B483] focus:border-amber-700 rounded-xl text-xs text-stone-900 placeholder:text-stone-500 focus:outline-hidden"
                />
              </div>

              {submitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Email draft prepared for contact@2qrcode.com. Thank you for reaching out!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border border-amber-700/25 font-extrabold text-xs rounded-xl cursor-pointer hover:from-amber-300 hover:to-amber-400 transition-all shadow-[0_6px_16px_rgba(180,120,18,0.2)]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
