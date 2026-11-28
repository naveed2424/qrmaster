import { QRCustomization } from '../types/qr';

export interface SharedQRConfig {
  v?: Record<string, unknown>;
  c?: Partial<QRCustomization>;
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(b64u: string): string {
  const padded = b64u.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64u.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function buildToolSharePermalink(
  toolId: string,
  formValues: Record<string, unknown>,
  customization: QRCustomization
): string {
  const cleanCustomization: Partial<QRCustomization> = {
    fgColor: customization.fgColor,
    bgColor: customization.bgColor,
    useGradient: customization.useGradient,
    gradientColor2: customization.gradientColor2,
    gradientAngle: customization.gradientAngle,
    dotStyle: customization.dotStyle,
    cornerStyle: customization.cornerStyle,
    eyeFrameColor: customization.eyeFrameColor,
    eyeBallColor: customization.eyeBallColor,
    errorCorrection: customization.errorCorrection,
    size: customization.size,
    logoPreset: customization.logoPreset,
    logoSizePercent: customization.logoSizePercent,
    frameType: customization.frameType,
    frameText: customization.frameText,
    frameColor: customization.frameColor,
    frameTextColor: customization.frameTextColor,
  };

  const payload: SharedQRConfig = {
    v: formValues,
    c: cleanCustomization,
  };

  const encoded = toBase64Url(JSON.stringify(payload));
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://2qrcode.com';
  return `${origin}/?tool=${encodeURIComponent(toolId)}&cfg=${encoded}`;
}

export function parseToolShareConfig(cfgParam: string | null): SharedQRConfig | null {
  if (!cfgParam || cfgParam.length > 8192) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(cfgParam)) as SharedQRConfig;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function copyPermalinkText(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
