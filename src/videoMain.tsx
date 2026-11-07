import { createRoot } from 'react-dom/client';
import UGCVideoView from './components/UGCVideoView';
import AnimatedQRBackground from './components/AnimatedQRBackground';
import BrandLogo from './components/BrandLogo';
import './index.css';

function VideoApp() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 relative overflow-x-hidden">
      {/* Background kinetic moving QR codes */}
      <AnimatedQRBackground />

      {/* Top Header with Brand Logo and Back to Site link */}
      <header className="relative z-20 border-b border-amber-500/20 bg-black/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="cursor-pointer transition-transform hover:scale-[1.02]">
            <BrandLogo size="sm" />
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-amber-400 font-bold px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
              60s TikTok UGC Ad Video (With Audio)
            </span>
            <a
              href="https://qrmust.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-500 px-3.5 py-1.5 rounded-xl shadow-sm hover:scale-105 transition-transform"
            >
              Open Site &rarr;
            </a>
          </div>
        </div>
      </header>

      {/* Main UGC Video Studio */}
      <main className="relative z-10 pb-16">
        <UGCVideoView />
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<VideoApp />);
