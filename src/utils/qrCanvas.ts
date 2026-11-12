import QRCode from 'qrcode';
import { QRCustomization } from '../types/qr';

// SVG Icon data for preset logos
export const PRESET_LOGOS: Record<string, { label: string; svg: string; color: string }> = {
  wifi: {
    label: 'Wi-Fi',
    color: '#059669',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  },
  whatsapp: {
    label: 'WhatsApp',
    color: '#25D366',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.15c-.24.67-1.39 1.28-1.92 1.36-.5.08-1.15.11-3.69-.94-3.25-1.34-5.33-4.66-5.49-4.88-.16-.22-1.3-1.73-1.3-3.3 0-1.57.82-2.35 1.11-2.67.29-.32.63-.4.84-.4.21 0 .42.01.6.02.19.01.45-.07.7.53.26.62.89 2.18.97 2.34.08.16.13.35.03.56-.1.21-.15.34-.3.51-.15.17-.32.38-.46.51-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.17 1.38 2.48 1.53.31.16.49.13.67-.08.19-.21.79-.92 1-1.24.21-.31.42-.26.7-.16.29.1 1.82.86 2.13 1.02.31.15.52.23.6.36.08.13.08.76-.16 1.43z"/></svg>`,
  },
  instagram: {
    label: 'Instagram',
    color: '#E4405F',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  },
  google: {
    label: 'Google',
    color: '#4285F4',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>`,
  },
  apple: {
    label: 'Apple',
    color: '#000000',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.56-.69.95-1.64.84-2.6-.82.03-1.82.55-2.41 1.24-.52.61-.98 1.58-.86 2.51.92.07 1.87-.47 2.43-1.15z"/></svg>`,
  },
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
  twitter: {
    label: 'X (Twitter)',
    color: '#000000',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  bitcoin: {
    label: 'Bitcoin',
    color: '#F7931A',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.638 14.904c-1.602 6.43-8.089 10.344-14.52 8.742C2.69 22.043-1.222 15.556.38 9.125 1.982 2.695 8.47-1.218 14.9 0.384c6.43 1.603 10.342 8.09 8.738 14.52zm-7.632-4.048c.28-.84.22-1.46-.22-1.9-.66-.66-1.74-.74-2.86-.74h-2.18l-.5 2h2.24c.78 0 1.28.18 1.48.5.22.34.2.78-.06 1.46l-.54 1.42c-.22.62-.64.9-1.26.9h-2.3l.56-2.24H8.7l-1.02 4.1h1.72l.46-1.86h1.74c1.24 0 2.38-.18 3.08-.82.68-.62.88-1.5.54-2.42l-.24-.64z"/></svg>`,
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
  },
  spotify: {
    label: 'Spotify',
    color: '#1DB954',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  },
  github: {
    label: 'GitHub',
    color: '#24292e',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  },
};

// Cache for compiled QR data matrices to avoid re-calculating on visual edits (colors, eyes, frames)
const matrixCache = new Map<string, any>();

function getQRMatrix(payload: string, errorCorrection: string) {
  const cacheKey = `${errorCorrection}:::${payload}`;
  if (matrixCache.has(cacheKey)) {
    return matrixCache.get(cacheKey);
  }
  // Keep cache size bounded
  if (matrixCache.size > 80) {
    matrixCache.clear();
  }
  const data = QRCode.create(payload, {
    errorCorrectionLevel: (errorCorrection as any) || 'H',
  });
  matrixCache.set(cacheKey, data);
  return data;
}

/**
 * Renders the high-fidelity QR code onto an HTML5 Canvas.
 * Supports preview clamping for ultra-fast (sub-2ms) live editing and full-res export.
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QRCustomization,
  isExport = false
): Promise<void> {
  const payload = text && text.trim() ? text : 'https://2qrcode.com';

  // 1. Retrieve or generate QR Code Raw Data Matrix with caching
  const qrData = getQRMatrix(payload, options.errorCorrection || 'H');

  const moduleCount = qrData.modules.size;
  // For live preview on screen, 420px is razor-sharp on Retina while rendering 10x faster
  const targetBaseSize = isExport ? Math.max(320, options.size || 512) : Math.min(420, Math.max(320, options.size || 512));
  const qrBaseSize = targetBaseSize;

  // Compute frame layout padding
  let topPadding = 24;
  let bottomPadding = 24;
  const horizontalPadding = 24;

  const hasFrame = options.frameType && options.frameType !== 'none';
  const frameText = (options.frameText || 'SCAN ME').trim().toUpperCase();

  if (hasFrame) {
    if (options.frameType === 'bottom-bar') {
      bottomPadding = 84;
    } else if (options.frameType === 'top-header') {
      topPadding = 74;
      bottomPadding = 24;
    } else if (options.frameType === 'polaroid') {
      topPadding = 28;
      bottomPadding = 94;
    } else if (options.frameType === 'badge') {
      bottomPadding = 72;
    } else if (options.frameType === 'minimal-tag') {
      bottomPadding = 64;
    }
  }

  const canvasWidth = qrBaseSize + horizontalPadding * 2;
  const canvasHeight = qrBaseSize + topPadding + bottomPadding;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 2. Draw canvas frame / background
  ctx.fillStyle = options.bgColor || '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Decorative frame container if applicable
  if (hasFrame) {
    drawFrameOuter(ctx, canvasWidth, canvasHeight, topPadding, bottomPadding, horizontalPadding, options);
  }

  // 3. Coordinate math for the QR matrix
  const qrOriginX = horizontalPadding;
  const qrOriginY = topPadding;
  const cellSize = qrBaseSize / moduleCount;

  // Setup QR Foreground Fill / Gradient
  let fgStyle: string | CanvasGradient = options.fgColor || '#0f172a';
  if (options.useGradient) {
    const angleRad = ((options.gradientAngle || 45) * Math.PI) / 180;
    const x2 = qrOriginX + Math.cos(angleRad) * qrBaseSize;
    const y2 = qrOriginY + Math.sin(angleRad) * qrBaseSize;
    const grad = ctx.createLinearGradient(qrOriginX, qrOriginY, x2, y2);
    grad.addColorStop(0, options.fgColor || '#059669');
    grad.addColorStop(1, options.gradientColor2 || '#0284c7');
    fgStyle = grad;
  }

  // Identify Finder Pattern Eyes (Top-Left, Top-Right, Bottom-Left)
  // Each eye is 7x7 modules
  const isEye = (r: number, c: number): boolean => {
    // Top-Left (0..6, 0..6)
    if (r < 7 && c < 7) return true;
    // Top-Right (0..6, count-7..count-1)
    if (r < 7 && c >= moduleCount - 7) return true;
    // Bottom-Left (count-7..count-1, 0..6)
    if (r >= moduleCount - 7 && c < 7) return true;
    return false;
  };

  // Center mask region (protects the logo if present)
  const hasLogo = Boolean(options.logoPreset || options.customLogoUrl);
  const logoSizePx = hasLogo ? qrBaseSize * (options.logoSizePercent / 100 || 0.22) : 0;
  const logoBoxMinX = qrOriginX + (qrBaseSize - logoSizePx) / 2 - cellSize;
  const logoBoxMaxX = qrOriginX + (qrBaseSize + logoSizePx) / 2 + cellSize;
  const logoBoxMinY = qrOriginY + (qrBaseSize - logoSizePx) / 2 - cellSize;
  const logoBoxMaxY = qrOriginY + (qrBaseSize + logoSizePx) / 2 + cellSize;

  // 4. Draw Data Modules (Dots / Squares)
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (!qrData.modules.get(r, c)) continue;
      // Skip finder patterns (drawn with custom eye renderer below)
      if (isEye(r, c)) continue;

      const x = qrOriginX + c * cellSize;
      const y = qrOriginY + r * cellSize;

      // Skip modules directly under the centered logo
      if (hasLogo && x >= logoBoxMinX && x <= logoBoxMaxX && y >= logoBoxMinY && y <= logoBoxMaxY) {
        continue;
      }

      ctx.fillStyle = fgStyle;
      drawModule(ctx, x, y, cellSize, options.dotStyle || 'square');
    }
  }

  // 5. Draw the 3 Finder Pattern Eyes with high polish
  const eyeCoords = [
    { r: 0, c: 0 },
    { r: 0, c: moduleCount - 7 },
    { r: moduleCount - 7, c: 0 },
  ];

  for (const eye of eyeCoords) {
    const eyeX = qrOriginX + eye.c * cellSize;
    const eyeY = qrOriginY + eye.r * cellSize;
    const eyeWidth = cellSize * 7;
    drawEye(
      ctx,
      eyeX,
      eyeY,
      eyeWidth,
      cellSize,
      options.cornerStyle || 'square',
      options.eyeFrameColor || options.fgColor || '#0f172a',
      options.eyeBallColor || options.fgColor || '#0f172a',
      options.bgColor || '#ffffff'
    );
  }

  // 6. Draw Logo (Preset or Uploaded)
  if (hasLogo) {
    await drawLogo(ctx, qrOriginX + qrBaseSize / 2, qrOriginY + qrBaseSize / 2, logoSizePx, options);
  }

  // 7. Draw Frame Text Banner if frame is active
  if (hasFrame) {
    drawFrameInnerBanner(ctx, canvasWidth, canvasHeight, topPadding, bottomPadding, horizontalPadding, frameText, options);
  }
}

/**
 * Draws a single data module according to dot style.
 */
function drawModule(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: string) {
  const pad = 0.4;
  const drawX = x + pad;
  const drawY = y + pad;
  const drawSize = Math.max(1, size - pad * 2);

  if (style === 'dots') {
    ctx.beginPath();
    ctx.arc(drawX + drawSize / 2, drawY + drawSize / 2, drawSize / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'rounded') {
    const r = drawSize * 0.35;
    drawRoundedRect(ctx, drawX, drawY, drawSize, drawSize, r);
    ctx.fill();
  } else if (style === 'classy') {
    // Elegant diamond star
    ctx.beginPath();
    const cx = drawX + drawSize / 2;
    const cy = drawY + drawSize / 2;
    const r = drawSize / 2;
    ctx.moveTo(cx, drawY);
    ctx.quadraticCurveTo(cx, cy, drawX + drawSize, cy);
    ctx.quadraticCurveTo(cx, cy, cx, drawY + drawSize);
    ctx.quadraticCurveTo(cx, cy, drawX, cy);
    ctx.quadraticCurveTo(cx, cy, cx, drawY);
    ctx.closePath();
    ctx.fill();
  } else {
    // Classic square
    ctx.fillRect(drawX, drawY, drawSize, drawSize);
  }
}

/**
 * Draws the 7x7 Finder Pattern Eye.
 */
function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  cellSize: number,
  cornerStyle: string,
  frameColor: string,
  ballColor: string,
  bgColor: string
) {
  const outerSize = width;
  const innerSpaceSize = cellSize * 5;
  const pupilSize = cellSize * 3;

  const innerSpaceX = x + cellSize;
  const innerSpaceY = y + cellSize;
  const pupilX = x + cellSize * 2;
  const pupilY = y + cellSize * 2;

  // Corner radius calculation
  let outerRadius = 0;
  let pupilRadius = 0;

  if (cornerStyle === 'rounded') {
    outerRadius = outerSize * 0.22;
    pupilRadius = pupilSize * 0.28;
  } else if (cornerStyle === 'extra-rounded') {
    outerRadius = outerSize * 0.38;
    pupilRadius = pupilSize * 0.42;
  } else if (cornerStyle === 'circle') {
    outerRadius = outerSize / 2;
    pupilRadius = pupilSize / 2;
  }

  // 1. Outer Frame (7x7)
  ctx.fillStyle = frameColor;
  if (outerRadius > 0) {
    drawRoundedRect(ctx, x, y, outerSize, outerSize, outerRadius);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, outerSize, outerSize);
  }

  // 2. Inner Space Cutout (5x5) in background color
  ctx.fillStyle = bgColor;
  const spaceRadius = Math.max(0, outerRadius - cellSize);
  if (spaceRadius > 0) {
    drawRoundedRect(ctx, innerSpaceX, innerSpaceY, innerSpaceSize, innerSpaceSize, spaceRadius);
    ctx.fill();
  } else {
    ctx.fillRect(innerSpaceX, innerSpaceY, innerSpaceSize, innerSpaceSize);
  }

  // 3. Central Pupil (3x3)
  ctx.fillStyle = ballColor;
  if (pupilRadius > 0) {
    drawRoundedRect(ctx, pupilX, pupilY, pupilSize, pupilSize, pupilRadius);
    ctx.fill();
  } else {
    ctx.fillRect(pupilX, pupilY, pupilSize, pupilSize);
  }
}

/**
 * Draws the logo with protective mask in the center of the QR code.
 */
async function drawLogo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  logoSizePx: number,
  options: QRCustomization
): Promise<void> {
  const maskRadius = logoSizePx * 0.65;

  // 1. Protective circular background mask
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, maskRadius, 0, Math.PI * 2);
  ctx.fillStyle = options.bgColor || '#ffffff';
  ctx.fill();

  // Subtle border around mask
  ctx.lineWidth = Math.max(2, logoSizePx * 0.05);
  ctx.strokeStyle = options.fgColor || '#059669';
  ctx.stroke();
  ctx.restore();

  // 2. Render preset or custom image
  if (options.customLogoUrl) {
    try {
      const img = await loadImage(options.customLogoUrl);
      const drawW = logoSizePx * 0.9;
      const drawH = logoSizePx * 0.9;
      ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    } catch {
      // Fallback silently if custom image fails to load
    }
  } else if (options.logoPreset && PRESET_LOGOS[options.logoPreset]) {
    const preset = PRESET_LOGOS[options.logoPreset];
    const iconW = logoSizePx * 0.85;
    const iconH = logoSizePx * 0.85;

    // Convert SVG to Image
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconW}" height="${iconH}" color="${preset.color}" fill="${preset.color}">${preset.svg}</svg>`;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
      const img = await loadImage(url);
      ctx.drawImage(img, cx - iconW / 2, cy - iconH / 2, iconW, iconH);
    } catch {
      // Ignore
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/**
 * Draws the outer frame border or ribbon.
 */
function drawFrameOuter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  _topPad: number,
  _bottomPad: number,
  _horizPad: number,
  options: QRCustomization
) {
  const frameColor = options.frameColor || options.fgColor || '#059669';

  ctx.save();
  if (options.frameType === 'polaroid') {
    // Polaroid border
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e2e8f0';
    drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 12);
    ctx.stroke();
  } else if (options.frameType === 'minimal-tag') {
    ctx.lineWidth = 3;
    ctx.strokeStyle = frameColor;
    drawRoundedRect(ctx, 6, 6, width - 12, height - 12, 16);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws the frame CTA text banner (Bottom pill, Header, Polaroid text, etc.).
 */
function drawFrameInnerBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  _topPad: number,
  _bottomPad: number,
  _horizPad: number,
  text: string,
  options: QRCustomization
) {
  const frameColor = options.frameColor || '#059669';
  const textColor = options.frameTextColor || '#ffffff';

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (options.frameType === 'bottom-bar') {
    const bannerH = 50;
    const bannerW = width - 40;
    const bannerX = 20;
    const bannerY = height - 68;

    // Stylish pill banner
    ctx.fillStyle = frameColor;
    drawRoundedRect(ctx, bannerX, bannerY, bannerW, bannerH, bannerH / 2);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = '700 16px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(text, width / 2, bannerY + bannerH / 2);
  } else if (options.frameType === 'top-header') {
    const bannerH = 46;
    const bannerW = width - 36;
    const bannerX = 18;
    const bannerY = 14;

    ctx.fillStyle = frameColor;
    drawRoundedRect(ctx, bannerX, bannerY, bannerW, bannerH, 12);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(text, width / 2, bannerY + bannerH / 2);
  } else if (options.frameType === 'polaroid') {
    ctx.fillStyle = '#0f172a';
    ctx.font = '600 18px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillText(text, width / 2, height - 48);
  } else if (options.frameType === 'badge') {
    const badgeW = Math.min(width - 60, ctx.measureText(text).width + 60);
    const badgeH = 40;
    const badgeX = (width - badgeW) / 2;
    const badgeY = height - 58;

    ctx.fillStyle = frameColor;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 8);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = '700 14px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(text, width / 2, badgeY + badgeH / 2);
  } else if (options.frameType === 'minimal-tag') {
    ctx.fillStyle = frameColor;
    ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(text, width / 2, height - 36);
  }

  ctx.restore();
}

/**
 * Helper to draw rounded rectangle path.
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Helper to load an image from URL or dataURL.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Exports high-resolution PNG or JPG at full user-selected resolution (up to 2048px).
 */
export async function exportHighResCanvas(
  payload: string,
  options: QRCustomization,
  format: 'png' | 'jpg',
  filename = 'qr-code.png'
): Promise<void> {
  const offscreen = document.createElement('canvas');
  await renderQRToCanvas(offscreen, payload, options, true);
  const mime = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'png' ? 1.0 : 0.95;
  const link = document.createElement('a');
  link.download = filename;
  link.href = offscreen.toDataURL(mime, quality);
  link.click();
}

/**
 * Downloads canvas directly as PNG.
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename = 'qr-code.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

/**
 * Downloads canvas directly as JPG.
 */
export function downloadCanvasAsJpg(canvas: HTMLCanvasElement, filename = 'qr-code.jpg') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.click();
}

/**
 * Renders a QR code at full export resolution and returns a PNG or JPG Blob.
 */
export async function renderQRToBlob(
  payload: string,
  options: QRCustomization,
  format: 'png' | 'jpg'
): Promise<Blob> {
  const offscreen = document.createElement('canvas');
  await renderQRToCanvas(offscreen, payload, options, true);
  const mime = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'png' ? 1.0 : 0.95;
  return new Promise((resolve, reject) => {
    offscreen.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to encode QR image blob'));
      },
      mime,
      quality
    );
  });
}

/**
 * Generates a scalable SVG XML string matching user color & error correction settings.
 */
export async function generateQRSvgString(
  payload: string,
  options: QRCustomization
): Promise<string> {
  const text = payload && payload.trim() ? payload : 'https://2qrcode.com';
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: options.errorCorrection || 'H',
    color: {
      dark: options.fgColor || '#0f172a',
      light: options.bgColor || '#ffffff',
    },
    margin: 2,
    width: options.size || 512,
  });
}

/**
 * Downloads vector SVG of the QR code.
 */
export async function downloadCanvasAsSvg(
  payload: string,
  options: QRCustomization,
  filename = 'qr-code.svg'
): Promise<void> {
  const rawSvg = await generateQRSvgString(payload, options);

  const blob = new Blob([rawSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Copies the canvas image directly to the clipboard.
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        resolve(true);
      } catch {
        resolve(false);
      }
    }, 'image/png');
  });
}


