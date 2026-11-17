import { ShieldCheck, Heart } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onSelectTool: (toolId: string) => void;
}

export default function Footer({ onNavigate, onSelectTool }: FooterProps) {
  return (
    <footer className="bg-black text-zinc-300 border-t border-amber-500/20 mt-20 relative z-10">
      {/* Pre-footer Call to Action Banner matching Page 5 of PDF in Gold & Black */}
      <div className="max-w-6xl mx-auto px-4 -translate-y-10">
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-8 sm:p-10 border border-amber-500/40 shadow-[0_10px_50px_rgba(245,158,11,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to get started?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Create your customizable and high-performing QR codes. Unlock advanced vector SVG export, implement your branding, and download with zero account sign-up.
            </p>
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('directory');
            }}
            className="px-7 py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] whitespace-nowrap cursor-pointer hover:scale-105"
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
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Take your business or idea to the next level with our suite of 70+ specialized, privacy-friendly QR code generators. Always 100% free, hosted on modern edge networks with client-side security.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>100% Client-Side Private · Zero Server Storage</span>
            </div>
          </div>

          {/* Service Links matching Reference Site */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Service
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <a href="?view=batch" onClick={(e) => { e.preventDefault(); onNavigate('batch'); }} className="hover:text-amber-300 transition-colors cursor-pointer font-semibold text-amber-300/90">
                  Batch CSV QR Generator
                </a>
              </li>
              <li>
                <a href="?tool=wifi" onClick={(e) => { e.preventDefault(); onSelectTool('wifi'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Wi-Fi QR Code
                </a>
              </li>
              <li>
                <a href="?tool=vcard" onClick={(e) => { e.preventDefault(); onSelectTool('vcard'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  vCard Digital Business Card
                </a>
              </li>
              <li>
                <a href="?tool=menu" onClick={(e) => { e.preventDefault(); onSelectTool('menu'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Restaurant Menu QR
                </a>
              </li>
              <li>
                <a href="?tool=reviews" onClick={(e) => { e.preventDefault(); onSelectTool('reviews'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Google Reviews Booster
                </a>
              </li>
              <li>
                <a href="?view=converter" onClick={(e) => { e.preventDefault(); onNavigate('converter'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Print Metric Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal Links (Google AdSense Compliance) */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Company &amp; Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <a href="?view=about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  About 2qrcode.com (Afzal Naveed)
                </a>
              </li>
              <li>
                <a href="?view=blog" onClick={(e) => { e.preventDefault(); onNavigate('blog'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Blog &amp; Guides
                </a>
              </li>
              <li>
                <a href="?view=faqs" onClick={(e) => { e.preventDefault(); onNavigate('faqs'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  General FAQs
                </a>
              </li>
              <li>
                <a href="?view=privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="?view=cookies" onClick={(e) => { e.preventDefault(); onNavigate('cookies'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Cookie &amp; Ad Policy
                </a>
              </li>
              <li>
                <a href="?view=terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Terms &amp; Disclaimer
                </a>
              </li>
              <li>
                <a href="?view=contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Guarantee Box in Gold */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Free Promise
            </h3>
            <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-2 text-xs text-zinc-300 shadow-md">
              <p className="font-extrabold text-amber-300">No Subscription Paywall</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Your static QR codes never expire. Print on packaging, menus, or cards with 100% confidence.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" aria-hidden="true" />
                <span>Crafted by 2qrcode.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © 2026 2qrcode.com · Built by Afzal Naveed. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="?view=privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-amber-300 cursor-pointer">Privacy</a>
            <a href="?view=cookies" onClick={(e) => { e.preventDefault(); onNavigate('cookies'); }} className="hover:text-amber-300 cursor-pointer">Cookies</a>
            <button type="button" onClick={() => window.dispatchEvent(new Event('2qrcode-open-cookie-settings'))} className="hover:text-amber-300 cursor-pointer">Cookie Settings</button>
            <a href="?view=terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-amber-300 cursor-pointer">Terms</a>
            <a href="?view=contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-amber-300 cursor-pointer">Contact</a>
            <span>&apos;QR Code&apos; is a registered trademark of DENSO WAVE INCORPORATED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
