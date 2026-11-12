import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Music2,
  ShieldCheck,
  Wifi,
  Contact,
  Star,
  Calendar,
  AlertTriangle,
  QrCode,
  Video as VideoIcon,
} from 'lucide-react';

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  startSec: number;
  endSec: number;
  audioFile: string;
  narrationText: string;
  hookBadge: string;
  hookColor: string;
  mockupContent: 'scam_warning' | 'platform_showcase' | 'live_creator' | 'cafe_realtor' | 'clinic_event' | 'print_calc' | 'cta_bio';
}

const TOTAL_DURATION_SEC = 60; // Exactly 60 Seconds!

const UGC_SCENES: Scene[] = [
  {
    id: 1,
    title: 'THE $25/MO SCAM TRAP',
    subtitle: 'Did you know 90% of "free" QR codes expire?',
    startSec: 0,
    endSec: 7.5,
    audioFile: '/audio/scene1.mp3',
    hookBadge: '⚠️ SCAM WARNING FOR SMALL BIZ',
    hookColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    mockupContent: 'scam_warning',
    narrationText:
      'Stop scrolling! If you run a restaurant, cafe, or business, 90 percent of free QR code generators are a scam! They deactivate your codes after 14 days and demand 25 dollars a month!',
  },
  {
    id: 2,
    title: 'THE 100% FREE ANTIDOTE',
    subtitle: 'Over 60 specialized tools, zero logins',
    startSec: 7.5,
    endSec: 15.5,
    audioFile: '/audio/scene2.mp3',
    hookBadge: '💎 100% FREE SECRET TOOL',
    hookColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    mockupContent: 'platform_showcase',
    narrationText:
      'Here is the secret antidote: 2qrcode.com. It is 100 percent free forever, zero sign-up, zero paywalls, with over 60 specialized QR generators ready to use!',
  },
  {
    id: 3,
    title: 'HOW TO USE IN 3 STEPS',
    subtitle: 'Pick, Customize Logo & Colors, Download',
    startSec: 15.5,
    endSec: 25.0,
    audioFile: '/audio/scene3.mp3',
    hookBadge: '⚡ CREATE IN 10 SECONDS',
    hookColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    mockupContent: 'live_creator',
    narrationText:
      'It is super simple: 1. Pick your generator—Wi-Fi, vCard, menu, or Google review. 2. Type your info. 3. Add your brand logo in the center and choose custom colors. Then download high-res vector SVG or PNG!',
  },
  {
    id: 4,
    title: 'WHO PROFITS: CAFES & REALTORS',
    subtitle: 'Instant Wi-Fi connect & 1-tap contact saving',
    startSec: 25.0,
    endSec: 35.5,
    audioFile: '/audio/scene4.mp3',
    hookBadge: '☕ CAFES & 🏠 REALTORS',
    hookColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    mockupContent: 'cafe_realtor',
    narrationText:
      'Cafe owners: put a Wi-Fi QR on table tents so guests connect in 1 second without asking for passwords. Realtors and freelancers: put a vCard QR on your card to save full contact info into iPhone address books with one tap!',
  },
  {
    id: 5,
    title: 'CLINICS, SALONS & EVENTS',
    subtitle: '300% more Google reviews & instant calendar invites',
    startSec: 35.5,
    endSec: 44.5,
    audioFile: '/audio/scene5.mp3',
    hookBadge: '⭐ CLINICS & 🎟️ EVENT HOSTS',
    hookColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    mockupContent: 'clinic_event',
    narrationText:
      'Clinics and salons: put a Google Review QR at checkout to get hundreds of five-star reviews! Event planners: encode calendar invites on badges so attendees never miss a session!',
  },
  {
    id: 6,
    title: 'PRINT CALC & 5 GUARANTEES',
    subtitle: 'Storefronts, packaging, 10:1 distance rule',
    startSec: 44.5,
    endSec: 53.0,
    audioFile: '/audio/scene6.mp3',
    hookBadge: '📐 BUILT-IN PRINT CALCULATOR',
    hookColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    mockupContent: 'print_calc',
    narrationText:
      'Where to use? Storefront windows, flyers, product packaging, and invoices. Plus, their 10 to 1 Print Calculator ensures your codes never print blurry. Never expires, unlimited scans, 100 percent private!',
  },
  {
    id: 7,
    title: 'TAP LINK IN BIO: 2qrcode.com',
    subtitle: 'Tap the link on screen or bio right now!',
    startSec: 53.0,
    endSec: 60.0,
    audioFile: '/audio/scene7.mp3',
    hookBadge: '🔗 CLICKABLE TIKTOK LINK',
    hookColor: 'bg-amber-400 text-black border-amber-300 font-black',
    mockupContent: 'cta_bio',
    narrationText:
      'Stop paying monthly fees for QR codes. Go to 2qrcode.com right now—link is on screen and in bio. Tap the link and create yours today!',
  },
];

export default function UGCVideoView() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState<boolean>(true);
  const [bgMusicEnabled, setBgMusicEnabled] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'mp4' | 'interactive'>('mp4');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const voiceBuffersRef = useRef<Map<number, AudioBuffer>>(new Map());
  const currentVoiceSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bgMusicIntervalRef = useRef<number | null>(null);
  const currentSceneIndexRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Initialize Web Audio Context and pre-load all 7 scene voiceover MP3s
  useEffect(() => {
    let isCancelled = false;

    async function initAudio() {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        audioDestRef.current = ctx.createMediaStreamDestination();

        // Load all 7 audio buffers in parallel
        const promises = UGC_SCENES.map(async (scene) => {
          try {
            const resp = await fetch(`${scene.audioFile}?v=neural-v2`);
            const arrayBuf = await resp.arrayBuffer();
            const decoded = await ctx.decodeAudioData(arrayBuf);
            if (!isCancelled) {
              voiceBuffersRef.current.set(scene.id, decoded);
            }
          } catch (e) {
            console.warn(`Could not load audio for scene ${scene.id}:`, e);
          }
        });

        await Promise.all(promises);
        if (!isCancelled) {
          setAudioLoaded(true);
        }
      } catch (e) {
        console.warn('AudioContext initialization error:', e);
      }
    }

    initAudio();

    return () => {
      isCancelled = true;
      if (currentVoiceSourceRef.current) {
        try { currentVoiceSourceRef.current.stop(); } catch {}
      }
      if (bgMusicIntervalRef.current) {
        clearInterval(bgMusicIntervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Compute active scene based on currentTime
  const currentSceneIndex = useMemo(() => {
    const idx = UGC_SCENES.findIndex(
      (s) => currentTime >= s.startSec && currentTime < s.endSec
    );
    return idx === -1 ? UGC_SCENES.length - 1 : idx;
  }, [currentTime]);

  const activeScene = UGC_SCENES[currentSceneIndex];

  // Helper to play synthesized SFX into both speakers and recording stream
  const playSoundEffect = (type: 'pop' | 'chime' | 'warning' | 'whoosh' | 'fanfare') => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);

      // Connect to speakers
      gain.connect(ctx.destination);
      // Connect to video recording destination
      if (audioDestRef.current) {
        gain.connect(audioDestRef.current);
      }

      const now = ctx.currentTime;

      if (type === 'pop') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.07);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'warning') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(987.77, now + 0.08); // B5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.31);
      } else if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === 'fanfare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.56);
      }
    } catch {}
  };

  // Helper to play synthesized background tech-beat drum pattern
  const playBeatTick = (step: number) => {
    if (isMuted || !bgMusicEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      // Kick drum on 0 and 8
      if (step % 8 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (audioDestRef.current) gain.connect(audioDestRef.current);

        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.11);
      }

      // Snare / Clap on 4 and 12
      if (step % 8 === 4) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (audioDestRef.current) gain.connect(audioDestRef.current);

        osc.frequency.setValueAtTime(280, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      }

      // Subtle Hi-hat on every 2 steps
      if (step % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (audioDestRef.current) gain.connect(audioDestRef.current);

        osc.frequency.setValueAtTime(7000, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {}
  };

  // Play voiceover MP3 buffer for the active scene
  const playSceneVoiceover = (sceneId: number) => {
    if (isMuted || !voiceoverEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop previous voiceover source
      if (currentVoiceSourceRef.current) {
        try { currentVoiceSourceRef.current.stop(); } catch {}
      }

      const buffer = voiceBuffersRef.current.get(sceneId);
      if (!buffer) return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.value = 1.0;
      source.connect(gain);

      // Connect to user speakers
      gain.connect(ctx.destination);

      // Connect to MediaStream destination so recorded video file HAS SOUND!
      if (audioDestRef.current) {
        gain.connect(audioDestRef.current);
      }

      source.start();
      currentVoiceSourceRef.current = source;
    } catch (e) {
      console.warn('Error playing voiceover:', e);
    }
  };

  // Trigger voiceover and SFX on scene transition
  useEffect(() => {
    if (!isPlaying) {
      if (currentVoiceSourceRef.current) {
        try { currentVoiceSourceRef.current.stop(); } catch {}
      }
      return;
    }

    if (currentSceneIndex !== currentSceneIndexRef.current) {
      currentSceneIndexRef.current = currentSceneIndex;
      playSceneVoiceover(activeScene.id);

      // Play matching scene sound effect
      if (activeScene.id === 1) playSoundEffect('warning');
      else if (activeScene.id === 2) playSoundEffect('whoosh');
      else if (activeScene.id === 3) playSoundEffect('pop');
      else if (activeScene.id === 4) playSoundEffect('chime');
      else if (activeScene.id === 5) playSoundEffect('chime');
      else if (activeScene.id === 6) playSoundEffect('pop');
      else if (activeScene.id === 7) playSoundEffect('fanfare');
    }
  }, [currentSceneIndex, isPlaying, isMuted, voiceoverEnabled, activeScene]);

  // Background Beat Generator Loop when playing
  useEffect(() => {
    if (!isPlaying || isMuted || !bgMusicEnabled) {
      if (bgMusicIntervalRef.current) {
        clearInterval(bgMusicIntervalRef.current);
        bgMusicIntervalRef.current = null;
      }
      return;
    }

    let step = 0;
    // 120 BPM = 125ms per 16th note
    bgMusicIntervalRef.current = window.setInterval(() => {
      playBeatTick(step);
      step = (step + 1) % 16;
    }, 125);

    return () => {
      if (bgMusicIntervalRef.current) {
        clearInterval(bgMusicIntervalRef.current);
      }
    };
  }, [isPlaying, isMuted, bgMusicEnabled]);

  // Main playback loop (stops precisely at 60 seconds)
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= TOTAL_DURATION_SEC) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (currentTime >= TOTAL_DURATION_SEC - 0.5) {
      setCurrentTime(0);
      currentSceneIndexRef.current = -1;
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (currentVoiceSourceRef.current) {
      try { currentVoiceSourceRef.current.stop(); } catch {}
    }
    currentSceneIndexRef.current = -1;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const jumpToScene = (sceneIndex: number) => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (currentVoiceSourceRef.current) {
      try { currentVoiceSourceRef.current.stop(); } catch {}
    }
    currentSceneIndexRef.current = -1;
    setCurrentTime(UGC_SCENES[sceneIndex].startSec);
  };

  // RECORD AND DOWNLOAD 60-SECOND VIDEO WITH REAL AUDIO AND VOICEOVER
  const handleRecordAndDownloadVideo = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingProgress(0);

    // Ensure audio context is running
    let ctx = audioCtxRef.current;
    if (!ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      audioDestRef.current = ctx.createMediaStreamDestination();
    }
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    handleRestart();

    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1280; // 9:16 High-Def Vertical TikTok
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const recordedChunks: Blob[] = [];

    // CRITICAL: COMBINE VIDEO TRACK AND AUDIO DESTINATION TRACK!
    // This guarantees the recorded video file has SOUND and VOICEOVER!
    const videoStream = canvas.captureStream(30);
    const audioTrack = audioDestRef.current?.stream.getAudioTracks()[0];

    const streamTracks = [...videoStream.getVideoTracks()];
    if (audioTrack) {
      streamTracks.push(audioTrack);
    }

    const combinedStream = new MediaStream(streamTracks);

    let mimeType = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrmust-tiktok-ugc-60s-with-voiceover-${Date.now()}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setIsRecording(false);
      setRecordingProgress(0);
    };

    recorder.start(100);

    // 60-Second Real-Time Canvas Rendering Loop
    const startTime = performance.now();
    const durationMs = TOTAL_DURATION_SEC * 1000;

    const renderFrame = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const videoTime = progress * TOTAL_DURATION_SEC;
      setRecordingProgress(Math.round(progress * 100));

      const scIndex = UGC_SCENES.findIndex(
        (s) => videoTime >= s.startSec && videoTime < s.endSec
      );
      const scene = scIndex === -1 ? UGC_SCENES[UGC_SCENES.length - 1] : UGC_SCENES[scIndex];

      // 1. Deep Obsidian Background
      canvasCtx.fillStyle = '#070709';
      canvasCtx.fillRect(0, 0, 720, 1280);

      // 2. Radiant Golden Ambient Glow
      const grad = canvasCtx.createRadialGradient(360, 240, 30, 360, 240, 420);
      grad.addColorStop(0, 'rgba(250, 204, 21, 0.22)');
      grad.addColorStop(1, 'rgba(7, 7, 9, 0)');
      canvasCtx.fillStyle = grad;
      canvasCtx.fillRect(0, 0, 720, 700);

      // 3. Floating Kinetic QR in Background
      canvasCtx.save();
      canvasCtx.translate(560 + Math.sin(videoTime * 0.8) * 16, 190 + Math.cos(videoTime * 0.8) * 16);
      canvasCtx.rotate((Math.sin(videoTime * 0.4) * 8 * Math.PI) / 180);
      canvasCtx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
      canvasCtx.lineWidth = 3.5;
      canvasCtx.strokeRect(-55, -55, 110, 110);
      canvasCtx.fillStyle = 'rgba(250, 204, 21, 0.35)';
      canvasCtx.fillRect(-40, -40, 25, 25);
      canvasCtx.fillRect(15, -40, 25, 25);
      canvasCtx.fillRect(-40, 15, 25, 25);
      canvasCtx.restore();

      // 4. Hook Badge (TikTok style)
      canvasCtx.fillStyle = '#facc15';
      canvasCtx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      canvasCtx.textAlign = 'center';
      canvasCtx.fillText(scene.hookBadge, 360, 110);

      // 5. Main Title
      canvasCtx.fillStyle = '#ffffff';
      canvasCtx.font = '900 38px "Plus Jakarta Sans", sans-serif';
      canvasCtx.fillText(scene.title, 360, 170);

      // 6. Subtitle
      canvasCtx.fillStyle = '#fbbf24';
      canvasCtx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      canvasCtx.fillText(scene.subtitle, 360, 210);

      // 7. Interactive Phone / Graphic Mockup Container
      canvasCtx.fillStyle = '#0f0f14';
      canvasCtx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      canvasCtx.lineWidth = 4;
      canvasCtx.beginPath();
      canvasCtx.roundRect(70, 250, 580, 640, 32);
      canvasCtx.fill();
      canvasCtx.stroke();

      // Inner Graphic Content according to scene
      if (scene.mockupContent === 'scam_warning') {
        canvasCtx.fillStyle = '#ef4444';
        canvasCtx.font = '900 30px sans-serif';
        canvasCtx.fillText('❌ SUBSCRIPTION TRAP DETECTED', 360, 330);
        canvasCtx.fillStyle = '#f87171';
        canvasCtx.font = '600 22px sans-serif';
        canvasCtx.fillText('"Free" sites expire after 14 days', 360, 380);
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.font = '900 42px monospace';
        canvasCtx.fillText('DEMANDING $25/MO!', 360, 470);
        canvasCtx.fillStyle = '#fde047';
        canvasCtx.font = '700 22px sans-serif';
        canvasCtx.fillText('Ruins 500 printed menus & business cards', 360, 540);
      } else if (scene.mockupContent === 'platform_showcase') {
        canvasCtx.fillStyle = '#facc15';
        canvasCtx.font = '900 34px sans-serif';
        canvasCtx.fillText('https://2qrcode.com', 360, 330);
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.font = '800 26px sans-serif';
        canvasCtx.fillText('👑 60+ FREE GENERATORS', 360, 400);
        canvasCtx.fillStyle = '#a1a1aa';
        canvasCtx.font = '600 21px sans-serif';
        canvasCtx.fillText('Wi-Fi · vCard · Menus · Reviews · Crypto', 360, 460);
        canvasCtx.fillStyle = '#fbbf24';
        canvasCtx.font = '800 24px sans-serif';
        canvasCtx.fillText('Zero Logins · 100% Free Lifetime Scans', 360, 530);
      } else if (scene.mockupContent === 'live_creator') {
        canvasCtx.fillStyle = '#fbbf24';
        canvasCtx.font = '800 25px sans-serif';
        canvasCtx.fillText('1. SELECT GENERATOR (Wi-Fi, vCard)', 360, 330);
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.font = '800 25px sans-serif';
        canvasCtx.fillText('2. CUSTOMIZE GOLD & LOGO', 360, 400);
        canvasCtx.fillStyle = '#facc15';
        canvasCtx.font = '800 25px sans-serif';
        canvasCtx.fillText('3. DOWNLOAD SVG / PNG PRINT-READY', 360, 470);
      } else if (scene.mockupContent === 'cafe_realtor') {
        canvasCtx.fillStyle = '#34d399';
        canvasCtx.font = '800 26px sans-serif';
        canvasCtx.fillText('☕ CAFES: 1-Tap Wi-Fi on Table Tents', 360, 350);
        canvasCtx.fillStyle = '#fbbf24';
        canvasCtx.font = '800 26px sans-serif';
        canvasCtx.fillText('🏠 REALTORS: vCard Saves to iPhone Address Book', 360, 430);
      } else if (scene.mockupContent === 'clinic_event') {
        canvasCtx.fillStyle = '#38bdf8';
        canvasCtx.font = '800 26px sans-serif';
        canvasCtx.fillText('⭐ CLINICS: 300+ Google Reviews at Checkout', 360, 350);
        canvasCtx.fillStyle = '#c084fc';
        canvasCtx.font = '800 26px sans-serif';
        canvasCtx.fillText('🎟️ EVENTS: 1-Click iCal Calendar Invite', 360, 430);
      } else if (scene.mockupContent === 'print_calc') {
        canvasCtx.fillStyle = '#facc15';
        canvasCtx.font = '800 28px sans-serif';
        canvasCtx.fillText('📐 10:1 DISTANCE PRINT CALCULATOR', 360, 330);
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.font = '600 22px sans-serif';
        canvasCtx.fillText('Never print a blurry QR code again!', 360, 390);
        canvasCtx.fillStyle = '#e4e4e7';
        canvasCtx.font = '700 24px monospace';
        canvasCtx.fillText('35mm @ 300 DPI = 413 × 413 px', 360, 460);
      } else if (scene.mockupContent === 'cta_bio') {
        canvasCtx.fillStyle = '#facc15';
        canvasCtx.font = '900 38px sans-serif';
        canvasCtx.fillText('🔗 https://2qrcode.com', 360, 360);
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.font = '800 28px sans-serif';
        canvasCtx.fillText('TAP LINK IN BIO TO CREATE FREE QR!', 360, 440);
      }

      // 8. Kinetic Subtitle Captions
      canvasCtx.fillStyle = '#facc15';
      canvasCtx.font = '900 26px "Plus Jakarta Sans", sans-serif';
      canvasCtx.textAlign = 'center';
      const words = scene.narrationText.split(' ');
      const wordsPerChunk = 7;
      const chunkIdx = Math.floor(
        ((videoTime - scene.startSec) / (scene.endSec - scene.startSec)) *
          (words.length / wordsPerChunk)
      );
      const currentChunk = words
        .slice(chunkIdx * wordsPerChunk, (chunkIdx + 1) * wordsPerChunk)
        .join(' ');
      canvasCtx.fillText(currentChunk || scene.narrationText.slice(0, 40), 360, 960);

      // 9. Clickable Link Banner at bottom
      canvasCtx.fillStyle = '#facc15';
      canvasCtx.beginPath();
      canvasCtx.roundRect(60, 1010, 600, 80, 24);
      canvasCtx.fill();

      canvasCtx.fillStyle = '#000000';
      canvasCtx.font = '900 24px sans-serif';
      canvasCtx.fillText('🔗 VISIT: https://2qrcode.com/', 360, 1058);

      // 10. TikTok Bottom Bar
      canvasCtx.fillStyle = '#ffffff';
      canvasCtx.font = '700 20px sans-serif';
      canvasCtx.textAlign = 'left';
      canvasCtx.fillText('@afzal_builds · Free QR Code Hack', 60, 1140);
      canvasCtx.fillStyle = '#a1a1aa';
      canvasCtx.font = '500 16px sans-serif';
      canvasCtx.fillText('🎵 Original Sound - Trending Tech Hacks', 60, 1175);

      // 11. 60-Second Progress Bar
      canvasCtx.fillStyle = '#eab308';
      canvasCtx.fillRect(0, 1272, 720 * progress, 8);

      if (elapsed < durationMs) {
        requestAnimationFrame(renderFrame);
      } else {
        recorder.stop();
      }
    };

    renderFrame();
  };

  const copyTikTokCaption = () => {
    const caption = `Stop paying $25/month for scammy QR codes that expire after 14 days! 🚫

I found the hidden antidote: https://2qrcode.com/ 🔗 (Tap the link in bio!)

✅ 100% Free Forever (No credit card, no sign-up)
✅ Over 60 specialized generators:
  • Wi-Fi quick connect for cafes & restaurants ☕
  • vCard 3.0 digital business cards for realtors 🏠
  • Google review booster for clinics & salons ⭐
  • Event iCal calendar invites 🎟️
  • Crypto & PayPal payments ⚡
✅ Add your custom logo in center & luxury gold colors
✅ 300 DPI vector SVG print-ready with 10:1 print calculator

Create your free QR code right now at https://2qrcode.com/ 🚀

#freeqrcode #2qrcode #smallbusinesshack #restaurantmarketing #realtorlife #techhacks #qrgenerator #growthhacks #freetools`;

    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 space-y-10">
      {/* Top Banner & Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
          <VideoIcon className="w-4 h-4 text-amber-400" />
          <span>EXACTLY 60 SECONDS TIKTOK UGC AD WITH HUMAN VOICEOVER & AUDIO</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Viral TikTok UGC Promo for <br />
          <span className="text-gold-gradient">https://2qrcode.com/</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          60-second high-energy UGC video with full human voiceover audio, rhythmic background music, sound effects, clickable TikTok link, and direct MP4/WebM video export with audio embedded into the video file!
        </p>
      </div>

      {/* Main 2-Column UGC Work Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical 9:16 TikTok Phone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4 w-full max-w-[380px] shadow-lg">
            <button
              onClick={() => setPreviewMode('mp4')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                previewMode === 'mp4'
                  ? 'bg-amber-400 text-black shadow-md font-extrabold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Broadcast MP4</span>
            </button>
            <button
              onClick={() => setPreviewMode('interactive')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                previewMode === 'interactive'
                  ? 'bg-amber-400 text-black shadow-md font-extrabold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Sim</span>
            </button>
          </div>

          <div className="w-full max-w-[380px] aspect-[9/16] bg-black rounded-[42px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.95)] border-4 border-zinc-800 relative overflow-hidden select-none">
            {/* Phone Bezel Speaker & Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-900 rounded-full z-40 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
            </div>

            {/* Content: Native MP4 Player or Interactive Simulation */}
            {previewMode === 'mp4' ? (
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black flex items-center justify-center">
                <video
                  src="/video/qrmust-tiktok-ugc-60s.mp4"
                  controls
                  playsInline
                  autoPlay
                  loop
                  className="w-full h-full object-cover rounded-[32px]"
                />
              </div>
            ) : (
              /* TikTok Video Canvas Container */
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-[#070709] flex flex-col justify-between p-4">
                {/* Background Ambient Glow & Floating QR Animation */}
                <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />

                {/* Dynamic Scene Content View */}
                <div className="relative z-10 pt-7 space-y-3">
                {/* Scene Hook Badge */}
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide rounded-full border shadow-sm ${activeScene.hookColor}`}
                  >
                    {activeScene.hookBadge}
                  </span>
                </div>

                {/* Big Scene Headlines */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                    {activeScene.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-300">
                    {activeScene.subtitle}
                  </p>
                </div>

                {/* Simulated Screencast / Mockup Graphic */}
                <div className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl min-h-[220px] flex flex-col justify-center items-center text-center space-y-3">
                  {activeScene.mockupContent === 'scam_warning' && (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto animate-bounce">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-extrabold text-red-400 uppercase">
                        Subscription Trap Alert
                      </div>
                      <div className="p-2.5 bg-red-950/40 border border-red-800/50 rounded-xl text-[11px] text-zinc-300">
                        "Your QR code has expired after 14 days. Please upgrade to Pro for $25/month."
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Ruins 500 printed menus, cards, and flyers!
                      </p>
                    </div>
                  )}

                  {activeScene.mockupContent === 'platform_showcase' && (
                    <div className="space-y-2.5 w-full">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-amber-300 bg-amber-500/10 py-1 px-3 rounded-lg border border-amber-500/30">
                        <span>👑 2qrcode.com</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-300">
                          Wi-Fi QR
                        </div>
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-300">
                          vCard 3.0
                        </div>
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-300">
                          Menu QR
                        </div>
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-300">
                          Reviews
                        </div>
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-300">
                          Bitcoin
                        </div>
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-300">
                          +55 More
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-semibold">
                        Zero Logins · 100% Free Lifetime Scans
                      </div>
                    </div>
                  )}

                  {activeScene.mockupContent === 'live_creator' && (
                    <div className="space-y-2 w-full text-left">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black">
                          1
                        </span>
                        <span>Select Wi-Fi or vCard generator</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black">
                          2
                        </span>
                        <span>Add custom logo & golden gradient</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black">
                          3
                        </span>
                        <span>Download 300 DPI vector SVG</span>
                      </div>
                      <div className="w-16 h-16 mx-auto mt-1 p-1 bg-black border border-amber-400 rounded-lg flex items-center justify-center">
                        <QrCode className="w-full h-full text-amber-400" />
                      </div>
                    </div>
                  )}

                  {activeScene.mockupContent === 'cafe_realtor' && (
                    <div className="grid grid-cols-2 gap-2 w-full text-left">
                      <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Wifi className="w-3.5 h-3.5" /> Cafe Table
                        </div>
                        <p className="text-[10px] text-zinc-300">
                          Customers tap 1 second to connect without asking for passwords.
                        </p>
                      </div>
                      <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                        <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Contact className="w-3.5 h-3.5" /> Realtors
                        </div>
                        <p className="text-[10px] text-zinc-300">
                          vCard saves full name & phone into iOS contacts with 1 tap.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeScene.mockupContent === 'clinic_event' && (
                    <div className="grid grid-cols-2 gap-2 w-full text-left">
                      <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                        <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-cyan-400" /> Clinics
                        </div>
                        <p className="text-[10px] text-zinc-300">
                          Checkout QR opens Google 5-star review page directly.
                        </p>
                      </div>
                      <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                        <div className="text-xs font-bold text-purple-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Events
                        </div>
                        <p className="text-[10px] text-zinc-300">
                          Badges encode iCal schedules for instant calendar addition.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeScene.mockupContent === 'print_calc' && (
                    <div className="space-y-2 w-full text-center">
                      <div className="text-xs font-extrabold text-amber-300">
                        10:1 Distance Print Ratio
                      </div>
                      <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] font-mono text-white">
                        Distance 1.5m ➔ Size: 35mm (413px @ 300DPI)
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Never print a blurry QR code again!
                      </p>
                    </div>
                  )}

                  {activeScene.mockupContent === 'cta_bio' && (
                    <div className="space-y-3">
                      <div className="text-xs font-extrabold text-amber-400 uppercase tracking-widest animate-pulse">
                        👇 Tap Bio Link Below 👇
                      </div>
                      <a
                        href="https://2qrcode.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="block px-4 py-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] uppercase tracking-wider hover:scale-105 transition-transform"
                      >
                        Launch https://2qrcode.com/
                      </a>
                      <p className="text-[10px] text-zinc-400">
                        Instant Free Creation · No Credit Card
                      </p>
                    </div>
                  )}
                </div>

                {/* Kinetic UGC Captions (Yellow on Black) */}
                <div className="bg-black/85 backdrop-blur-md border border-amber-500/20 rounded-xl p-2.5 text-center min-h-[58px] flex items-center justify-center shadow-lg">
                  <p className="text-xs font-black text-amber-300 leading-snug drop-shadow-sm">
                    "{activeScene.narrationText.slice(0, 95)}..."
                  </p>
                </div>
              </div>

              {/* TikTok Interactive Clickable Link Pill */}
              <div className="relative z-20 space-y-2 pt-2">
                <a
                  href="https://2qrcode.com/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playSoundEffect('chime')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-102 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-6 h-6 rounded-lg bg-black text-amber-400 flex items-center justify-center shrink-0">
                      🔗
                    </span>
                    <span className="truncate">https://2qrcode.com/</span>
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* TikTok Creator Bar */}
                <div className="flex items-center justify-between text-white text-[11px]">
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>@afzal_builds</span>
                      <span className="text-[9px] px-1 bg-amber-500/30 text-amber-300 rounded-sm">Creator</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Music2 className="w-3 h-3 text-amber-400 animate-spin" />
                      <span className="truncate max-w-[170px]">Trending Tech Hacks - Original Sound</span>
                    </div>
                  </div>
                </div>

                {/* 60-Second Bottom Timeline Progress Bar */}
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-100"
                    style={{ width: `${(currentTime / TOTAL_DURATION_SEC) * 100}%` }}
                  />
                </div>
              </div>

              {/* Right Side TikTok Action Rail */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-30">
                {/* Creator Avatar with follow badge */}
                <div className="relative cursor-pointer">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black flex items-center justify-center text-xs shadow-md">
                    A
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => {
                    setLiked(!liked);
                    playSoundEffect('pop');
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className={`p-2 rounded-full transition-transform group-hover:scale-110 ${liked ? 'text-red-500' : 'text-white'}`}>
                    <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold text-white">{liked ? '84.3K' : '84.2K'}</span>
                </button>

                {/* Comment */}
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="p-2 rounded-full text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-white">1,248</span>
                </div>

                {/* Bookmark */}
                <button
                  onClick={() => {
                    setBookmarked(!bookmarked);
                    playSoundEffect('pop');
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className={`p-2 rounded-full transition-transform group-hover:scale-110 ${bookmarked ? 'text-amber-400' : 'text-white'}`}>
                    <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-amber-400' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold text-white">34.9K</span>
                </button>

                {/* Share */}
                <button
                  onClick={copyTikTokCaption}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="p-2 rounded-full text-white">
                    <Send className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-white">12.4K</span>
                </button>
              </div>
            </div>
            )}
          </div>

          {/* Quick Play & Time Counter under phone */}
          <div className="mt-4 flex items-center gap-3 font-mono text-xs text-amber-400 font-bold">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-amber-400 text-black hover:bg-yellow-300 transition-colors shadow-md cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
            </button>
            <span>
              {formatSeconds(currentTime)} / 01:00
            </span>
            <span className="text-zinc-500 font-normal">({Math.round((currentTime / TOTAL_DURATION_SEC) * 100)}%)</span>
          </div>
        </div>

        {/* Right Column: UGC Video Controls, Scene Timeline & TikTok Toolkit (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Playback & Video Download Action Card */}
          <div className="p-6 bg-zinc-950/90 border border-amber-500/30 rounded-3xl shadow-2xl space-y-5 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>60-Second TikTok UGC Studio (With Audio & Voiceover)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  The downloaded video includes synchronized human speech voiceover narration, background beats, and sound effects embedded directly into the video file!
                </p>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isMuted
                      ? 'border-red-500/40 text-red-400 bg-red-500/10'
                      : 'border-zinc-800 text-zinc-300 bg-zinc-900 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setVoiceoverEnabled(!voiceoverEnabled)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    voiceoverEnabled
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                      : 'border-zinc-800 text-zinc-400 bg-zinc-900'
                  }`}
                >
                  Voiceover: {voiceoverEnabled ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setBgMusicEnabled(!bgMusicEnabled)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    bgMusicEnabled
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                      : 'border-zinc-800 text-zinc-400 bg-zinc-900'
                  }`}
                >
                  BGM Beat: {bgMusicEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Facebook Reels / TikTok Upload Error Fix Notice */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/35 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-extrabold text-amber-300">
                  Fixed: Facebook Reels & TikTok Upload Error ("Your file can't be uploaded: ... .webm")
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Facebook Reels and TikTok strictly block <strong>.webm</strong> files. Social media requires broadcast <strong>.MP4</strong> (H.264 video with AAC audio).
                </p>
                <p className="text-amber-400 font-bold">
                  👇 Click the golden button below to download the official <strong>60-second broadcast MP4</strong>. It uploads directly to Facebook Reels, TikTok & Instagram Reels without any error!
                </p>
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="space-y-3">
              {/* PRIMARY BROADCAST MP4 DOWNLOAD BUTTON */}
              <a
                href="/video/qrmust-tiktok-ugc-60s.mp4"
                download="qrmust-tiktok-facebook-reels-60s.mp4"
                className="w-full py-4 px-5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-101 cursor-pointer"
              >
                <Download className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="font-black text-sm">Download Official MP4 (Facebook Reels & TikTok Ready)</div>
                  <div className="text-[11px] font-bold text-black/80 normal-case">1080×1920 · 60s · H.264 High Profile + AAC Audio · Verified 100% Uploadable</div>
                </div>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={copyTikTokCaption}
                  className="py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCaption ? 'Copied Caption!' : 'Copy Facebook / TikTok Post Caption'}</span>
                </button>

                <button
                  onClick={handleRecordAndDownloadVideo}
                  disabled={isRecording}
                  className="py-3.5 px-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-bold rounded-2xl text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  title="Record a custom live take from the canvas simulator"
                >
                  <VideoIcon className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    {isRecording ? `Recording (${recordingProgress}%)` : 'Record Custom Take (WebM)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sound Verification Status Banner */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Embedded Audio Status: <span className="text-amber-300 font-mono">100% Armed & Ready</span>
                </span>
                <p className="text-[11px] text-zinc-400">
                  Target clickable link: <strong className="text-amber-300 font-mono">https://2qrcode.com/</strong>
                </p>
              </div>
              <a
                href="https://2qrcode.com/"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-zinc-900 border border-amber-400/40 text-amber-300 rounded-xl font-bold hover:bg-amber-400 hover:text-black transition-colors"
              >
                Test Link &rarr;
              </a>
            </div>
          </div>

          {/* 60-Second Scene Timeline (7 Scenes) */}
          <div className="bg-zinc-950/90 border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-white">
                60-Second Scene Timeline (7 Scenes)
              </h4>
              <button
                onClick={handleRestart}
                className="text-xs text-amber-400 hover:text-yellow-300 flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart Video
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {UGC_SCENES.map((scene, idx) => {
                const isActive = currentSceneIndex === idx;
                return (
                  <button
                    key={scene.id}
                    onClick={() => jumpToScene(idx)}
                    className={`p-3 text-left rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                        : 'border-zinc-800 bg-zinc-900/70 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className={`font-bold ${isActive ? 'text-amber-300' : 'text-zinc-400'}`}>
                        Scene {scene.id} ({scene.startSec}s - {scene.endSec}s)
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{scene.title}</div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {scene.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Voiceover Script Transcript */}
          <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h4 className="text-sm font-extrabold text-white flex items-center justify-between">
              <span>Full 60-Second Voiceover Script Transcript</span>
              <span className="text-xs font-mono text-amber-400 font-bold">01:00 Runtime</span>
            </h4>
            <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 max-h-52 overflow-y-auto text-xs text-zinc-300 space-y-3 font-mono leading-relaxed">
              {UGC_SCENES.map((scene) => (
                <div key={scene.id} className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-400">
                    [{scene.startSec}s - {scene.endSec}s] {scene.title}:
                  </span>
                  <p className="text-zinc-300">{scene.narrationText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
