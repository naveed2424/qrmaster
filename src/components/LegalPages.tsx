import { useState } from 'react';
import { Shield, FileText, Mail, Check, ArrowLeft } from 'lucide-react';

interface LegalPagesProps {
  page: 'privacy' | 'terms' | 'contact';
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <button
          onClick={() => onNavigate('directory')}
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-yellow-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 2qrcode.com Generators</span>
        </button>

        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          {(
            [
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'terms', label: 'Terms of Service' },
              { id: 'contact', label: 'Contact Us' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                page === tab.id
                  ? 'bg-amber-400 text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {page === 'privacy' && (
        <article className="p-8 sm:p-10 bg-zinc-950/90 border border-zinc-800 rounded-3xl space-y-6 text-sm text-zinc-300 leading-relaxed">
          <div className="space-y-2 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Shield className="w-4 h-4" />
              <span>2qrcode.com · Legal &amp; Data Protection</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
            <p className="text-xs text-zinc-400 font-mono">
              Effective Date: November 12, 2026 · Website: https://2qrcode.com
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">1. Client-Side QR Generation &amp; Zero Payload Storage</h2>
            <p>
              At <strong>2qrcode.com</strong>, your privacy is built into our architecture. All 60+ individual QR generators and our Batch CSV QR Code Generator compile QR code matrices directly inside your local web browser using HTML5 Canvas and vector SVG. Website URLs, Wi-Fi network passwords, vCard contact details, 2FA TOTP secrets, cryptocurrency wallet addresses, and uploaded CSV spreadsheets are never uploaded to, logged on, or stored by our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">2. Google AdSense &amp; Third-Party Advertising Cookies</h2>
            <p>
              2qrcode.com uses Google AdSense to serve advertisements and keep our 60+ QR generation tools and batch spreadsheet utilities 100% free without subscription fees.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
              </li>
              <li>
                Google&apos;s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to our visitors based on their visit to 2qrcode.com and other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising at any time by visiting{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline hover:text-yellow-300"
                >
                  Google Ads Settings (adssettings.google.com)
                </a>
                , or by reviewing{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline hover:text-yellow-300"
                >
                  Google Advertising Privacy &amp; Terms
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">3. Local Browser Preferences (localStorage)</h2>
            <p>
              We use standard browser <code>localStorage</code> solely to remember your chosen UI language (among our 16 supported languages), light/dark display theme, and any local tool ratings you submit. You may clear this data anytime via your browser settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">4. GDPR, CCPA &amp; Contact Rights</h2>
            <p>
              Visitors located in the European Economic Area (EEA), UK, or California retain full rights under GDPR and CCPA to request information, opt out of personalized cookies, or contact our publisher team regarding privacy compliance. Reach us at{' '}
              <button
                onClick={() => onNavigate('contact')}
                className="text-amber-400 underline font-semibold cursor-pointer"
              >
                contact@2qrcode.com
              </button>
              .
            </p>
          </section>
        </article>
      )}

      {page === 'terms' && (
        <article className="p-8 sm:p-10 bg-zinc-950/90 border border-zinc-800 rounded-3xl space-y-6 text-sm text-zinc-300 leading-relaxed">
          <div className="space-y-2 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <FileText className="w-4 h-4" />
              <span>2qrcode.com · Platform Usage Agreement</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
            <p className="text-xs text-zinc-400 font-mono">
              Last Updated: November 12, 2026 · Publisher: Afzal Naveed (2qrcode.com)
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">1. Perpetual Commercial License</h2>
            <p>
              All QR codes generated on <strong>2qrcode.com</strong>—including single static generators, customized logo QR designs, and bulk CSV batch exports—carry a 100% free, perpetual, worldwide commercial and personal license. You may print them on product packaging, restaurant menus, retail signs, and marketing brochures with zero royalties or scan limits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">2. Static Code Permanence</h2>
            <p>
              2qrcode.com generates direct static QR codes formatted to the ISO/IEC 18004 standard without proprietary middleman redirect servers. Because your destination data is written directly into the QR matrix, 2qrcode.com never expires, pauses, or throttles your printed codes. You remain solely responsible for maintaining the destination URLs, payment wallets, or Wi-Fi credentials encoded inside your QR codes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">3. Acceptable Use</h2>
            <p>
              You agree not to use 2qrcode.com to encode malicious phishing links, malware distribution URLs, fraudulent payment addresses, or unlawful content. Before mass printing any QR batch, users should test-scan generated codes on multiple smartphone devices under expected lighting and distance conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-amber-300">4. Trademark Attribution &amp; Warranty Disclaimer</h2>
            <p>
              &ldquo;QR Code&rdquo; is a registered trademark of DENSO WAVE INCORPORATED. 2qrcode.com provides its tools and editorial guides &ldquo;as is&rdquo; without warranties of any kind.
            </p>
          </section>
        </article>
      )}

      {page === 'contact' && (
        <div className="p-8 sm:p-10 bg-zinc-950/90 border border-zinc-800 rounded-3xl space-y-8">
          <div className="space-y-2 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Mail className="w-4 h-4" />
              <span>2qrcode.com · Support &amp; Editorial Desk</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Contact 2qrcode.com</h1>
            <p className="text-sm text-zinc-400">
              Have a question about bulk CSV generation, custom print sizing, editorial corrections, or advertising inquiries? Reach our team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4 text-xs text-zinc-300">
              <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1.5">
                <div className="font-bold text-amber-300">Publisher &amp; Lead Architect</div>
                <div className="text-white font-semibold">Afzal Naveed</div>
                <div className="text-zinc-400">2qrcode.com Engineering &amp; Editorial</div>
              </div>

              <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1.5">
                <div className="font-bold text-amber-300">Direct Email Channels</div>
                <div className="font-mono text-zinc-200">contact@2qrcode.com</div>
                <div className="font-mono text-zinc-400">Afzal460@gmail.com</div>
              </div>

              <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1.5">
                <div className="font-bold text-amber-300">Response Window</div>
                <p className="text-zinc-400 leading-relaxed">
                  Editorial feedback, privacy requests, and enterprise CSV formatting questions are typically answered within 24–48 business hours.
                </p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl text-xs text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl text-xs text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Inquiry Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl text-xs text-white focus:outline-hidden"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Batch CSV Generator Support">Batch CSV Generator Support</option>
                  <option value="Editorial / Technical Correction">Editorial / Technical Correction</option>
                  <option value="Privacy / AdSense Compliance">Privacy / AdSense Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or feedback..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl text-xs text-white focus:outline-hidden"
                />
              </div>

              {submitted && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Email draft prepared for contact@2qrcode.com. Thank you for reaching out!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs rounded-xl cursor-pointer hover:from-amber-300 hover:to-yellow-400 transition-all"
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
