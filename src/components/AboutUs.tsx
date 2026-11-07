import { Shield, Heart, Zap, Globe, Cpu, CheckCircle } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
          <Heart className="w-3.5 h-3.5 text-amber-400" />
          <span>Independent Creator Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Built for the Open Web, <br />
          <span className="text-gold-gradient">Always 100% Free</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          Created to eliminate the "subscription expiration trap" that ruins small business menus and event flyers. Pure client-side privacy, zero logins, and infinite free scans.
        </p>
      </div>

      {/* Creator Profile & Netlify Architecture */}
      <div className="p-8 sm:p-10 bg-zinc-950/90 border border-amber-500/25 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center backdrop-blur-xl">
        <div className="md:col-span-4 text-center md:text-left space-y-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-700 text-black font-extrabold text-3xl flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.35)] mx-auto md:mx-0">
            A
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              Afzal
            </h3>
            <p className="text-xs font-bold text-amber-400">
              Creator & Lead Engineer · Online QR Generator PRO
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Independent Web Developer & Privacy Advocate
            </p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-4 text-sm text-zinc-300 leading-relaxed border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8">
          <h4 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="text-gold-gradient">Why I built this platform</span>
          </h4>
          <p>
            Hello! I am <strong className="text-amber-300">Afzal</strong>. Like thousands of small business owners, freelancers, and designers, I was repeatedly disappointed by existing online QR code tools. Most sites claim to be "free," but after you spend money printing 500 restaurant menus or business cards, they suddenly deactivate your QR codes and demand a monthly subscription fee.
          </p>
          <p>
            I decided to build <strong className="text-amber-300">Online QR Generator PRO</strong> as a permanent antidote: an all-in-one suite of 60+ specialized generators designed to be completely free forever. No logins, no sign-ups, no monthly fees, and no expiring links.
          </p>
          <p>
            The entire app is architected for instant high performance on edge platforms like <strong className="text-amber-300">Netlify</strong> and modern static web delivery. Because all QR mathematical matrices are compiled directly in your browser using HTML5 Canvas and vector SVG, your Wi-Fi passwords, contact cards, and private links never touch a server database.
          </p>
        </div>
      </div>

      {/* 4 Pillars of the Platform */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Shield,
            title: '100% Client-Side Privacy',
            desc: 'Your data stays in your browser. Wi-Fi passwords and vCards are rendered locally and never stored on a remote server.',
          },
          {
            icon: Zap,
            title: 'Instant Edge Performance',
            desc: 'Built with optimized static assets and Vite to run with sub-second speeds anywhere in the world on Netlify and cloud edge networks.',
          },
          {
            icon: Cpu,
            title: 'Pure Vector SVG & 300 DPI',
            desc: 'Every generated code can be exported at commercial print resolution (up to 2048px) to guarantee flawless scanning on any physical material.',
          },
          {
            icon: Globe,
            title: 'Multilingual & Universal',
            desc: 'Localized across 16 popular global languages with built-in metric millimeter-to-inch converters and physical scan distance calculators.',
          },
        ].map((pillar, idx) => (
          <div
            key={idx}
            className="p-6 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/40 rounded-2xl space-y-3 transition-all shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <pillar.icon className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* Promises */}
      <div className="p-8 bg-amber-500/10 border border-amber-500/30 rounded-3xl space-y-4">
        <h3 className="text-lg font-extrabold text-amber-300">
          Our Permanent Guarantees to Every Visitor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Never a paid subscription paywall</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Never a scan count limit on static codes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Zero forced watermarks over your logos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Free commercial use rights for all generated designs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
