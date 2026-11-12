import { Shield, Heart, Zap, Globe, Cpu, CheckCircle, Code2, Server, Search, Lock, Printer, Mail } from 'lucide-react';
import founderPortrait from '../assets/images/founder_portrait_polished_1794521132031.jpg';

export default function AboutUs() {
  const handlePrintCV = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Afzal Naveed — Curriculum Vitae | 2qrcode.com</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; max-width: 820px; margin: 36px auto; padding: 0 24px; line-height: 1.55; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d97706; padding-bottom: 18px; margin-bottom: 24px; }
            .header-left h1 { margin: 0; font-size: 26px; font-weight: 800; }
            .header-left p { margin: 4px 0 0; font-size: 13px; color: #4b5563; }
            .portrait { width: 88px; height: 88px; border-radius: 12px; object-fit: cover; border: 2px solid #d97706; }
            h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.06em; color: #b45309; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 22px; }
            ul { padding-left: 18px; margin: 8px 0; }
            li { font-size: 13px; margin-bottom: 6px; }
            .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; }
            .meta { font-size: 12px; color: #6b7280; margin-top: 6px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-left">
              <h1>Afzal Naveed</h1>
              <p>Founder &amp; Senior Full-Stack, Cloud Security &amp; SEO Systems Engineer · 2qrcode.com</p>
              <div class="meta">Email: contact@2qrcode.com / Afzal460@gmail.com · Web: https://2qrcode.com</div>
            </div>
            <img src="${founderPortrait}" alt="Afzal Naveed Portrait" class="portrait" />
          </div>

          <h2>Executive Profile</h2>
          <p style="font-size:13px;">Senior Software &amp; Cloud Security Architect specializing in HTML5, JavaScript/TypeScript, Java enterprise systems, Technical SEO, and zero-trust cloud infrastructure. Creator of <strong>2qrcode.com</strong>, a privacy-first suite of 60+ static QR utilities and CSV batch generation pipelines.</p>

          <h2>Core Technical Expertise</h2>
          <div class="skills">
            <div><strong>Web &amp; Frontend:</strong> HTML5, Canvas 2D, SVG Vector Pipelines, CSS3, Tailwind CSS, React, TypeScript</div>
            <div><strong>Languages &amp; Backend:</strong> Java (Enterprise / REST APIs), JavaScript (ES2024+), Node.js, Client-Side Workers</div>
            <div><strong>Technical SEO &amp; Growth:</strong> Schema.org JSON-LD, Core Web Vitals, GEO/AEO Optimization, Crawler &amp; AdSense Architecture</div>
            <div><strong>Cloud &amp; Cybersecurity:</strong> Cloud Infrastructure Hardening, Zero-Trust Static Edge, 2FA TOTP, VPN Provisioning, CSP/TLS</div>
          </div>

          <h2>Selected Engineering Experience</h2>
          <ul>
            <li><strong>Founder &amp; Lead Systems Architect — 2qrcode.com (2025–Present):</strong> Engineered 60+ client-side ISO/IEC 18004 QR generators and an in-browser Batch CSV-to-ZIP compiler with Canvas 2D, Reed-Solomon Error Correction, and full multilingual localization.</li>
            <li><strong>Full-Stack Java &amp; JavaScript Engineer:</strong> Designed scalable web platforms combining enterprise Java backend services with high-speed HTML5/JavaScript interfaces, automated batch tooling, and strict security validation.</li>
            <li><strong>Technical SEO &amp; Cloud Security Specialist:</strong> Audited and hardened cloud web deployments, implemented CSP/HTTPS defenses, structured semantic JSON-LD graphs, and built compliant digital publishing architectures.</li>
          </ul>
        </body>
      </html>
    `);
    doc.close();
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => iframe.remove(), 1200);
    };
  };

  const expertiseAreas = [
    {
      icon: Code2,
      title: 'HTML5, JavaScript & TypeScript',
      years: 'Full-Stack Web',
      desc: 'Deep engineering in semantic HTML5, HTML5 Canvas 2D pixel pipelines, vector SVG generation, modern ES2024+ JavaScript, TypeScript, and zero-latency browser applications.',
    },
    {
      icon: Server,
      title: 'Java & Enterprise Architecture',
      years: 'Backend Systems',
      desc: 'Extensive experience building reliable Java services, object-oriented data processing engines, RESTful APIs, and concurrent batch automation workflows.',
    },
    {
      icon: Search,
      title: 'Technical SEO & Search Strategy',
      years: 'Organic Growth',
      desc: 'Hands-on mastery of Schema.org JSON-LD graphs, crawler architecture, XML sitemaps, Core Web Vitals speed optimization, and high-authority E-E-A-T publishing.',
    },
    {
      icon: Lock,
      title: 'Cloud & Cybersecurity',
      years: 'Zero-Trust Defense',
      desc: 'Focused on cloud infrastructure hardening, TLS/HTTPS & CSP security headers, air-gapped 2FA TOTP & WireGuard tooling, and privacy-preserving serverless architectures.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400">
          <Heart className="w-3.5 h-3.5 text-amber-400" />
          <span>Independent Creator &amp; Engineering Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
          Built for the Open Web, <br />
          <span className="text-gold-gradient">Always 100% Free</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          2qrcode.com was built to eliminate the &ldquo;subscription expiration trap&rdquo; that ruins small business menus and event flyers—combining pure client-side privacy, zero logins, and enterprise engineering.
        </p>
      </div>

      {/* Creator Profile & Polished Portrait */}
      <div className="p-8 sm:p-10 bg-zinc-950/90 border border-amber-500/25 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center backdrop-blur-xl">
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="w-36 h-36 rounded-2xl p-[2px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 shadow-[0_0_30px_rgba(251,191,36,0.28)] overflow-hidden">
            <img
              src={founderPortrait}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/naveed_281548ed.jpeg';
              }}
              alt="Afzal Naveed — Creator of 2qrcode.com"
              className="w-full h-full object-cover rounded-[14px] bg-zinc-900"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">
              Afzal Naveed
            </h2>
            <p className="text-xs font-bold text-amber-400">
              Founder &amp; Senior Systems Architect · 2qrcode.com
            </p>
            <p className="text-xs text-zinc-400">
              HTML · Java · JavaScript · Technical SEO · Cloud Security
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-zinc-400">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">contact@2qrcode.com</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-4 text-sm text-zinc-300 leading-relaxed border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8">
          <h3 className="text-base font-extrabold text-white">
            <span className="text-gold-gradient">Why I built 2qrcode.com</span>
          </h3>
          <p>
            Hello! I am <strong className="text-amber-300">Afzal Naveed</strong>, a software engineer and cloud security specialist with deep hands-on experience across <strong className="text-white">HTML5, JavaScript, Java, Technical SEO, and Cloud Security</strong>. Like thousands of business owners and developers, I grew frustrated watching &ldquo;free&rdquo; QR platforms silently hijack printed menus and brochures behind $30/month paywalls after 14 days.
          </p>
          <p>
            I engineered <strong className="text-amber-300">2qrcode.com</strong> as a permanent, transparent alternative: a suite of 60+ specialized QR code generators plus an in-browser Batch CSV generator designed to stay 100% free forever with zero account logins and zero expiring links.
          </p>
          <p>
            Every QR matrix, SVG vector, and CSV batch ZIP file is compiled directly inside your browser using optimized HTML5 Canvas and client-side JavaScript—ensuring your Wi-Fi passwords, vCards, 2FA secrets, and business data never touch an external database.
          </p>
        </div>
      </div>

      {/* Curriculum Vitae & Engineering Experience Section */}
      <section className="p-8 sm:p-10 bg-zinc-950/90 border border-zinc-800 rounded-3xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-400">Curriculum Vitae &amp; Technical Background</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Engineering Experience &amp; <span className="text-gold-gradient">Developer CV</span>
            </h2>
          </div>
          <button
            onClick={handlePrintCV}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save CV</span>
          </button>
        </div>

        {/* 4 Core Technical Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {expertiseAreas.map((area) => (
            <div
              key={area.title}
              className="p-5 bg-black/50 border border-zinc-800 rounded-2xl space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <area.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{area.title}</h3>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 shrink-0">{area.years}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>

        {/* Structured Experience Timeline & Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 border-t border-zinc-800/80">
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-sm font-bold text-amber-300">Career &amp; Engineering Milestones</h3>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-sm">Founder &amp; Lead Systems Architect — 2qrcode.com</span>
                  <span className="font-mono text-amber-400 shrink-0">2025 – Present</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Architected a zero-server client-side QR platform featuring 60+ specialized formats, Batch CSV-to-ZIP generation, 300 DPI print sizing math, 16-language localization, and full AdSense/E-E-A-T compliance.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-900 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-sm">Full-Stack Web &amp; Java Engineer</span>
                  <span className="font-mono text-zinc-400 shrink-0">Enterprise &amp; Web</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Built robust enterprise applications utilizing Java backend services, responsive HTML5/CSS3 layouts, and interactive JavaScript/TypeScript interfaces focused on speed, clean code maintainability, and reliability.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-900 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-sm">Cloud Security &amp; Technical SEO Consultant</span>
                  <span className="font-mono text-zinc-400 shrink-0">Infrastructure &amp; Growth</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Implemented cloud security controls (TLS, CSP, strict static isolation, safe 2FA TOTP &amp; WireGuard workflows) alongside structured Schema.org SEO architectures that maximize organic search visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-300">Verified Technical Stack</h3>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-1">
                <div className="font-bold text-white">Languages &amp; Core Web</div>
                <div className="font-mono text-[11px] text-zinc-400">
                  HTML5 · JavaScript (ES2024) · TypeScript · Java · CSS3 · SQL
                </div>
              </div>
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-1">
                <div className="font-bold text-white">Frontend &amp; Graphics</div>
                <div className="font-mono text-[11px] text-zinc-400">
                  React · Vite · Tailwind CSS · HTML5 Canvas 2D · Vector SVG
                </div>
              </div>
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-1">
                <div className="font-bold text-white">Cloud Security &amp; Networking</div>
                <div className="font-mono text-[11px] text-zinc-400">
                  Zero-Trust Architecture · Cloud Hardening · TLS/CSP · 2FA TOTP · WireGuard
                </div>
              </div>
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-1">
                <div className="font-bold text-white">Technical SEO &amp; Publishing</div>
                <div className="font-mono text-[11px] text-zinc-400">
                  Schema.org JSON-LD · Core Web Vitals · Sitemaps · GEO/AEO · Google AdSense
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of the Platform */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Shield,
            title: '100% Client-Side Privacy',
            desc: 'Your data stays in your browser. Wi-Fi passwords, vCards, and CSV spreadsheets are rendered locally and never stored on a remote server.',
          },
          {
            icon: Zap,
            title: 'Instant Cloud Edge Speed',
            desc: 'Built with optimized static assets and modern cloud edge networks to deliver sub-second QR generation anywhere in the world.',
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
