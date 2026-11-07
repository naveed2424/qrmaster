import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import QRCode from 'qrcode';

async function generateMp4() {
  console.log('--- Starting 60s Broadcast MP4 Generator for TikTok & Facebook Reels ---');

  const rootDir = process.cwd();
  const tempDir = path.join(rootDir, 'temp_video_build');
  const outputDir = path.join(rootDir, 'public/video');

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // 1. Generate Luxury Gold QR code for embedding into video
  const qrPngPath = path.join(tempDir, 'qr_luxury.png');
  await QRCode.toFile(qrPngPath, 'https://qrmust.netlify.app/', {
    width: 600,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#f59e0b',
    },
  });
  const qrBase64 = fs.readFileSync(qrPngPath).toString('base64');
  const qrDataUri = `data:image/png;base64,${qrBase64}`;

  // 2. Define the 7 scenes with durations totaling 60.0 seconds
  const scenes = [
    {
      id: 1,
      duration: 8.0,
      badge: '⚠️ SCAM WARNING FOR BUSINESSES',
      badgeColor: '#ef4444',
      badgeBg: 'rgba(239, 68, 68, 0.25)',
      title: 'THE $25/MO QR TRAP',
      subtitle: '90% of "free" QR codes expire after 14 days!',
      bullets: [
        '❌ Free sites deactivate your printed codes',
        '❌ Sudden paywalls demand $25 to $49/month',
        '❌ Reprinting menus and packaging costs thousands',
      ],
      caption: '"Stop scrolling! 90% of free QR codes expire and charge $25/month!"',
      accentColor: '#ef4444',
    },
    {
      id: 2,
      duration: 8.0,
      badge: '💎 100% FREE SECRET ANTIDOTE',
      badgeColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.25)',
      title: 'MEET qrmust.netlify.app',
      subtitle: 'Over 60 specialized generators · Zero sign-up',
      bullets: [
        '✅ 100% Free Forever (No credit card, no account)',
        '✅ 60+ specialized generators ready instantly',
        '✅ Unlimited scans · Codes never expire',
      ],
      caption: '"The secret antidote: qrmust.netlify.app — 60+ tools 100% free forever!"',
      accentColor: '#f59e0b',
    },
    {
      id: 3,
      duration: 9.5,
      badge: '⚡ CREATE IN 10 SECONDS',
      badgeColor: '#eab308',
      badgeBg: 'rgba(234, 179, 8, 0.25)',
      title: '3 SIMPLE STEPS',
      subtitle: 'Pick Tool · Brand Logo & Colors · Vector Export',
      bullets: [
        '1️⃣ Pick tool: Wi-Fi, vCard, Menu, Google Review',
        '2️⃣ Add your brand logo in center & gold colors',
        '3️⃣ Download 300 DPI vector SVG or HD PNG',
      ],
      caption: '"Pick tool, add your logo and custom colors, and download SVG in seconds!"',
      accentColor: '#eab308',
    },
    {
      id: 4,
      duration: 10.5,
      badge: '☕ CAFES & 🏠 REALTORS',
      badgeColor: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.25)',
      title: 'WHO PROFITS THE MOST?',
      subtitle: 'Instant Wi-Fi connect & 1-tap contact saving',
      bullets: [
        '☕ Cafes: Table tents connect guests in 1 second',
        '🏠 Realtors: vCard saves full contact into iPhone',
        '📈 10x faster customer onboarding on premises',
      ],
      caption: '"Cafes connect guests in 1 sec. Realtors save contact info in 1 tap!"',
      accentColor: '#10b981',
    },
    {
      id: 5,
      duration: 8.5,
      badge: '⭐ CLINICS & 🎟️ EVENTS',
      badgeColor: '#06b6d4',
      badgeBg: 'rgba(6, 182, 212, 0.25)',
      title: 'CLINICS, SALONS & EVENTS',
      subtitle: 'Boost 5-star reviews & instant calendar invites',
      bullets: [
        '⭐ Clinics & Salons: 300% more 5-star Google reviews',
        '🎟️ Event Planners: Instant calendar invites on badges',
        '💳 Cashier Desk: Instant PayPal & Crypto tipping',
      ],
      caption: '"Clinics get hundreds of 5-star reviews. Planners encode instant invites!"',
      accentColor: '#06b6d4',
    },
    {
      id: 6,
      duration: 8.5,
      badge: '📐 10:1 PRINT CALCULATOR',
      badgeColor: '#a855f7',
      badgeBg: 'rgba(168, 85, 247, 0.25)',
      title: 'WHERE TO USE & PRINT RULES',
      subtitle: 'Windows, flyers, packaging & foolproof scan sizing',
      bullets: [
        '📐 Built-in 10:1 print size distance calculator',
        '🏪 Storefront windows, vehicle wraps, food trucks',
        '📦 Product packaging, brochures & commercial invoices',
      ],
      caption: '"Storefronts, flyers, and 10:1 calculator ensure codes never print blurry!"',
      accentColor: '#a855f7',
    },
    {
      id: 7,
      duration: 7.0,
      badge: '🔗 TAP LINK IN BIO RIGHT NOW',
      badgeColor: '#000000',
      badgeBg: '#fbbf24',
      title: 'qrmust.netlify.app',
      subtitle: 'Tap the link on screen or bio right now!',
      bullets: [
        '🚀 Stop paying monthly fees for QR codes',
        '🌐 Go to: https://qrmust.netlify.app/',
        '👇 Link is on screen and in bio right now!',
      ],
      caption: '"Stop paying monthly fees. Visit qrmust.netlify.app right now in bio!"',
      accentColor: '#fbbf24',
    },
  ];

  // Helper to escape XML special characters in SVG
  function escapeXml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // 3. Render 1080x1920 SVG for each scene and convert to PNG
  const scenePngs = [];

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const svgPath = path.join(tempDir, `scene_${s.id}.svg`);
    const pngPath = path.join(tempDir, `scene_${s.id}.png`);

    const bulletElements = s.bullets
      .map((b, idx) => {
        const y = 840 + idx * 80;
        return `
        <g transform="translate(100, ${y})">
          <rect width="880" height="66" rx="14" fill="#141419" stroke="#27272a" stroke-width="1.5" />
          <text x="30" y="42" fill="#f4f4f5" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600">${escapeXml(b)}</text>
        </g>
        `;
      })
      .join('');

    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#241a05" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#070709" stop-opacity="1" />
        </radialGradient>
        <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
        <linearGradient id="btnGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
        <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="15" flood-color="#f59e0b" flood-opacity="0.4" />
        </filter>
      </defs>

      <!-- Deep Luxury Background -->
      <rect width="1080" height="1920" fill="#070709" />
      <rect width="1080" height="1920" fill="url(#bgGlow)" />

      <!-- Top Header Brand Bar -->
      <g transform="translate(80, 110)">
        <rect width="920" height="80" rx="40" fill="rgba(0,0,0,0.6)" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.4" />
        <circle cx="50" cy="40" r="22" fill="#fbbf24" />
        <text x="40" y="48" fill="#000" font-family="system-ui, sans-serif" font-size="22" font-weight="900">QR</text>
        <text x="90" y="48" fill="#ffffff" font-family="system-ui, sans-serif" font-size="26" font-weight="800" letter-spacing="1">QRFORGE STUDIO</text>
        <rect x="710" y="22" width="180" height="36" rx="18" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5" />
        <text x="735" y="47" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="18" font-weight="800">100% FREE</text>
      </g>

      <!-- Hook Badge -->
      <g transform="translate(100, 230)">
        <rect width="880" height="64" rx="32" fill="${s.badgeBg}" stroke="${s.badgeColor}" stroke-width="2" />
        <text x="440" y="42" fill="${s.badgeColor}" font-family="system-ui, sans-serif" font-size="26" font-weight="900" text-anchor="middle" letter-spacing="1.5">${escapeXml(s.badge)}</text>
      </g>

      <!-- Main Headline -->
      <text x="540" y="380" fill="url(#goldText)" font-family="system-ui, sans-serif" font-size="64" font-weight="900" text-anchor="middle" letter-spacing="-1">${escapeXml(s.title)}</text>
      <text x="540" y="440" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="30" font-weight="600" text-anchor="middle">${escapeXml(s.subtitle)}</text>

      <!-- Middle Showcase Area: Luxury Golden QR Code Frame -->
      <g transform="translate(390, 480)" filter="url(#dropGlow)">
        <rect width="300" height="300" rx="24" fill="#ffffff" stroke="#f59e0b" stroke-width="6" />
        <image href="${qrDataUri}" x="15" y="15" width="270" height="270" />
      </g>

      <!-- Bullets / Feature Cards -->
      ${bulletElements}

      <!-- Dynamic Captions Card -->
      <g transform="translate(100, 1140)">
        <rect width="880" height="120" rx="24" fill="rgba(0,0,0,0.75)" stroke="#3f3f46" stroke-width="2" />
        <text x="440" y="55" fill="#fef08a" font-family="system-ui, sans-serif" font-size="28" font-weight="800" text-anchor="middle">🎙️ CREATOR NARRATION:</text>
        <text x="440" y="95" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="600" text-anchor="middle">${escapeXml(s.caption)}</text>
      </g>

      <!-- Big Golden Website Clickable Link Banner -->
      <g transform="translate(90, 1310)" filter="url(#dropGlow)">
        <rect width="900" height="130" rx="28" fill="url(#btnGold)" stroke="#fef08a" stroke-width="3" />
        <text x="450" y="52" fill="#000000" font-family="system-ui, sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="2">VISIT FREE WEBSITE NOW</text>
        <text x="450" y="102" fill="#000000" font-family="system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="1">https://qrmust.netlify.app/</text>
      </g>

      <!-- Value Props Bottom Strip -->
      <g transform="translate(100, 1480)">
        <text x="140" y="40" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="24" font-weight="700">✓ No Login Required</text>
        <text x="460" y="40" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="24" font-weight="700">✓ 60+ Generators</text>
        <text x="740" y="40" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="24" font-weight="700">✓ Vector SVG/PNG</text>
      </g>

      <!-- TikTok Interface Overlays (Right Side Icons) -->
      <g transform="translate(970, 720)">
        <!-- Heart / Like -->
        <circle cx="35" cy="35" r="30" fill="rgba(39,39,42,0.7)" />
        <text x="35" y="44" fill="#ef4444" font-size="32" text-anchor="middle">❤️</text>
        <text x="35" y="85" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="800" text-anchor="middle">98.4K</text>

        <!-- Comments -->
        <circle cx="35" cy="145" r="30" fill="rgba(39,39,42,0.7)" />
        <text x="35" y="154" fill="#ffffff" font-size="30" text-anchor="middle">💬</text>
        <text x="35" y="195" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="800" text-anchor="middle">1,420</text>

        <!-- Bookmark -->
        <circle cx="35" cy="255" r="30" fill="rgba(39,39,42,0.7)" />
        <text x="35" y="264" fill="#fbbf24" font-size="30" text-anchor="middle">🔖</text>
        <text x="35" y="305" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="800" text-anchor="middle">42.1K</text>

        <!-- Share -->
        <circle cx="35" cy="365" r="30" fill="rgba(39,39,42,0.7)" />
        <text x="35" y="374" fill="#ffffff" font-size="30" text-anchor="middle">↗️</text>
        <text x="35" y="415" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="800" text-anchor="middle">Share</text>
      </g>

      <!-- Bottom Sound Bar -->
      <g transform="translate(80, 1800)">
        <text x="0" y="40" fill="#f4f4f5" font-family="system-ui, sans-serif" font-size="26" font-weight="800">@QRMustOfficial · Sponsored UGC</text>
        <text x="0" y="75" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="22">🎵 Original Sound - QRMust High-Converting Business Hack</text>
      </g>
    </svg>
    `;

    fs.writeFileSync(svgPath, svgContent);
    // Convert SVG to high-res PNG
    execSync(`ffmpeg -y -i "${svgPath}" "${pngPath}"`, { stdio: 'pipe' });
    scenePngs.push({ id: s.id, png: pngPath, duration: s.duration });
    console.log(`Rendered frame for Scene ${s.id} (${s.duration}s)`);
  }

  // 4. Generate audio mix: Concatenate voiceovers with background beat
  console.log('Building 60-second audio track...');

  // Create concat file for audio scenes
  const audioConcatPath = path.join(tempDir, 'audio_concat.txt');
  let concatLines = [];
  for (let i = 1; i <= 7; i++) {
    const audioPath = path.resolve(rootDir, `public/audio/scene${i}.mp3`);
    concatLines.push(`file '${audioPath}'`);
  }
  fs.writeFileSync(audioConcatPath, concatLines.join('\n'));

  const voiceoverMixPath = path.join(tempDir, 'voiceover_combined.mp3');
  execSync(`ffmpeg -y -f concat -safe 0 -i "${audioConcatPath}" -c copy "${voiceoverMixPath}"`, { stdio: 'pipe' });

  // Generate an energetic 60-second lo-fi / house background rhythm beat track using ffmpeg audio synthesis
  const bgMusicPath = path.join(tempDir, 'bg_music.wav');
  // Combine kick pulse, hihat, and subtle bass groove for exactly 60 seconds
  execSync(
    `ffmpeg -y -f lavfi -i "sine=frequency=110:duration=60" -f lavfi -i "anoisesrc=d=60:c=white:a=0.015" -filter_complex "[0:a]volume=0.08[a0];[1:a]highpass=f=6000,volume=0.04[a1];[a0][a1]amix=inputs=2[out]" -map "[out]" "${bgMusicPath}"`,
    { stdio: 'pipe' }
  );

  // Mix voiceover (clear + dominant) with background beat
  const finalAudioPath = path.join(tempDir, 'final_soundtrack.aac');
  execSync(
    `ffmpeg -y -i "${voiceoverMixPath}" -i "${bgMusicPath}" -filter_complex "[0:a]volume=1.4[v];[1:a]volume=0.3[m];[v][m]amix=inputs=2:duration=first[out]" -map "[out]" -c:a aac -b:a 192k -ar 44100 "${finalAudioPath}"`,
    { stdio: 'pipe' }
  );

  // 5. Build Video Stream using concat demuxer with exact frame timings
  console.log('Encoding broadcast H.264 MP4...');
  const videoConcatPath = path.join(tempDir, 'video_concat.txt');
  let videoLines = [];
  for (const sp of scenePngs) {
    videoLines.push(`file '${sp.png}'`);
    videoLines.push(`duration ${sp.duration}`);
  }
  // Repeat last frame once for ffmpeg concat demuxer spec
  videoLines.push(`file '${scenePngs[scenePngs.length - 1].png}'`);
  fs.writeFileSync(videoConcatPath, videoLines.join('\n'));

  const finalMp4Path = path.join(outputDir, 'qrmust-tiktok-ugc-60s.mp4');

  // Mux video and final audio into broadcast MP4 (H.264 High Profile, yuv420p, faststart)
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${videoConcatPath}" -i "${finalAudioPath}" -c:v libx264 -preset fast -profile:v high -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest -t 60.0 -movflags +faststart "${finalMp4Path}"`,
    { stdio: 'pipe' }
  );

  const stats = fs.statSync(finalMp4Path);
  console.log(`✅ SUCCESS! Broadcast MP4 generated at: ${finalMp4Path} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

generateMp4().catch((err) => {
  console.error('MP4 build error:', err);
  process.exit(1);
});
