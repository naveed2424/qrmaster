import { useEffect, useRef, useState } from 'react';

interface AdSenseUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default function AdSenseUnit({
  slot = '8358033803',
  format = 'auto',
  className = '',
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading');

  useEffect(() => {
    const el = adRef.current;
    if (!el || typeof window === 'undefined') return;

    const syncStatus = () => {
      const status = el.getAttribute('data-ad-status');
      if (status === 'unfilled') {
        setAdStatus('unfilled');
      } else if (status === 'filled') {
        setAdStatus('filled');
      }
    };

    syncStatus();

    const observer = new MutationObserver(syncStatus);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    });

    try {
      if (!el.dataset.adsbygoogleStatus && el.offsetWidth > 0) {
        const adsQueue = ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
        adsQueue.push({});
      }
    } catch {
      setAdStatus('unfilled');
    }

    return () => observer.disconnect();
  }, []);

  if (adStatus === 'unfilled') {
    return null;
  }

  return (
    <div
      className={`${adStatus === 'filled' ? 'my-8' : 'my-2'} text-center ${className}`}
      aria-label="Sponsored Advertisement"
    >
      {adStatus === 'filled' && (
        <div className="text-[10px] uppercase font-bold text-stone-600 tracking-wider mb-1.5">
          Advertisement
        </div>
      )}
      <div
        className={`w-full max-w-4xl mx-auto overflow-hidden flex items-center justify-center transition-all ${
          adStatus === 'filled'
            ? 'rounded-2xl bg-[#FFFDF9]/85 border border-[#DFC7A0] p-2 shadow-[0_6px_20px_-8px_rgba(120,82,25,0.12)]'
            : ''
        }`}
      >
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
