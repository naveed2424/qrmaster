import { useEffect, useRef } from 'react';

interface AdSenseUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default function AdSenseUnit({
  slot = '1234567890',
  format = 'auto',
  className = '',
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      // Ignore adsbygoogle push errors during development or ad blocker presence
    }
  }, []);

  return (
    <div className={`my-8 text-center ${className}`}>
      <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1.5">
        Advertisement
      </div>
      <div className="min-h-[100px] w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/60 border border-zinc-900 p-2 overflow-hidden flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-8358033803354457"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
