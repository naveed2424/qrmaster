import { ShieldCheck, Heart } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onSelectTool: (toolId: string) => void;
}

export default function Footer({ onNavigate, onSelectTool }: FooterProps) {
  return (
    <footer className="bg-[#EFE0C4]/95 text-stone-800 border-t border-[#D6B889] mt-20 relative z-10 backdrop-blur-md">
      {/* Pre-footer Call to Action Banner in Champagne Silk & Burnished Gold */}
      <div className="max-w-6xl mx-auto px-4 -translate-y-10">
        <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FBF2E3] to-[#F6E4C5] rounded-3xl p-8 sm:p-10 border border-[#D4B075] shadow-[0_14px_45px_rgba(120,82,25,0.16)] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Ready to get started?
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 max-w-xl">
              Create your customizable and high-performing QR codes. Unlock advanced vector SVG export, implement your branding, and download with zero account sign-up.
            </p>
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('directory');
            }}
            className="px-7 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 border border-amber-700/25 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-[0_6px_22px_rgba(180,115,20,0.28)] whitespace-nowrap cursor-pointer hover:scale-105"
          >
            Explore 70+ Generators &rarr;
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-xs text-stone-700 leading-relaxed max-w-sm">
              Take your business or idea to the next level with our suite of 70+ specialized, privacy-friendly QR code generators. Always 100% free, hosted on modern edge networks with client-side security.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-800 font-bold">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>100% Client-Side Private · Zero Server Storage</span>
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
              Service
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-700">
              <li>
                <a href="?view=batch" onClick={(e) => { e.preventDefault(); onNavigate('batch'); }} className="hover:text-amber-900 transition-colors cursor-pointer font-semibold text-amber-900">
                  Batch CSV QR Generator
                </a>
              </li>
              <li>
                <a href="?tool=wifi" onClick={(e) => { e.preventDefault(); onSelectTool('wifi'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Wi-Fi QR Code
                </a>
              </li>
              <li>
                <a href="?tool=vcard" onClick={(e) => { e.preventDefault(); onSelectTool('vcard'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  vCard Digital Business Card
                </a>
              </li>
              <li>
                <a href="?tool=menu" onClick={(e) => { e.preventDefault(); onSelectTool('menu'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Restaurant Menu QR
                </a>
              </li>
              <li>
                <a href="?tool=reviews" onClick={(e) => { e.preventDefault(); onSelectTool('reviews'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Google Reviews Booster
                </a>
              </li>
              <li>
                <a href="?view=converter" onClick={(e) => { e.preventDefault(); onNavigate('converter'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Print Metric Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal Links (Google AdSense Compliance) */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
              Company &amp; Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-700">
              <li>
                <a href="?view=about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  About 2qrcode.com (Afzal Naveed)
                </a>
              </li>
              <li>
                <a href="?view=blog" onClick={(e) => { e.preventDefault(); onNavigate('blog'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Blog &amp; Guides
                </a>
              </li>
              <li>
                <a href="?view=faqs" onClick={(e) => { e.preventDefault(); onNavigate('faqs'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  General FAQs
                </a>
              </li>
              <li>
                <a href="?view=privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="?view=cookies" onClick={(e) => { e.preventDefault(); onNavigate('cookies'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Cookie &amp; Ad Policy
                </a>
              </li>
              <li>
                <a href="?view=terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Terms &amp; Disclaimer
                </a>
              </li>
              <li>
                <a href="?view=contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-amber-900 transition-colors cursor-pointer">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Guarantee Box */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
              Free Promise
            </h3>
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#D4B075] space-y-2 text-xs text-stone-700 shadow-sm">
              <p className="font-extrabold text-amber-900">No Subscription Paywall</p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Your static QR codes never expire. Print on packaging, menus, or cards with 100% confidence.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" aria-hidden="true" />
                <span>Crafted by 2qrcode.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D6B889] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-700">
          <div>
            © 2026 2qrcode.com · Built by Afzal Naveed. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="?view=privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-amber-900 cursor-pointer">Privacy</a>
            <a href="?view=cookies" onClick={(e) => { e.preventDefault(); onNavigate('cookies'); }} className="hover:text-amber-900 cursor-pointer">Cookies</a>
            <button type="button" onClick={() => window.dispatchEvent(new Event('2qrcode-open-cookie-settings'))} className="hover:text-amber-900 cursor-pointer">Cookie Settings</button>
            <a href="?view=terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-amber-900 cursor-pointer">Terms</a>
            <a href="?view=contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-amber-900 cursor-pointer">Contact</a>
            <span>&apos;QR Code&apos; is a registered trademark of DENSO WAVE INCORPORATED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
