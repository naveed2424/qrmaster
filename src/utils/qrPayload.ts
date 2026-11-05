/**
 * Formats structured input values into standardized RFC-compliant QR payloads.
 */

export function formatWifi(ssid = '', encryption = 'WPA', password = '', hidden = false): string {
  const enc = encryption === 'none' ? 'nopass' : encryption;
  const h = hidden ? 'true' : 'false';
  // Escape special chars according to ZXing standard: \ ; , : "
  const cleanSsid = ssid.replace(/([\\;,":])/g, '\\$1');
  const cleanPass = password.replace(/([\\;,":])/g, '\\$1');
  return `WIFI:S:${cleanSsid};T:${enc};P:${cleanPass};H:${h};;`;
}

export function formatVCard(data: {
  firstName?: string;
  lastName?: string;
  organization?: string;
  jobTitle?: string;
  phoneWork?: string;
  phoneMobile?: string;
  email?: string;
  website?: string;
  address?: string;
  note?: string;
}): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName || ''};${data.firstName || ''};;;`,
    `FN:${(data.firstName || '') + ' ' + (data.lastName || '')}`.trim(),
  ];

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.jobTitle) lines.push(`TITLE:${data.jobTitle}`);
  if (data.phoneMobile) lines.push(`TEL;TYPE=CELL:${data.phoneMobile}`);
  if (data.phoneWork) lines.push(`TEL;TYPE=WORK,VOICE:${data.phoneWork}`);
  if (data.email) lines.push(`EMAIL;TYPE=PREF,INTERNET:${data.email}`);
  if (data.website) lines.push(`URL:${data.website.startsWith('http') ? data.website : 'https://' + data.website}`);
  if (data.address) lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);
  if (data.note) lines.push(`NOTE:${data.note}`);

  lines.push('END:VCARD');
  return lines.join('\n');
}

export function formatMeCard(data: {
  name?: string;
  tel?: string;
  email?: string;
  url?: string;
  memo?: string;
}): string {
  return `MECARD:N:${data.name || ''};TEL:${data.tel || ''};EMAIL:${data.email || ''};URL:${data.url || ''};NOTE:${data.memo || ''};;`;
}

export function formatEmail(to = '', subject = '', body = ''): string {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  const q = params.toString();
  return `mailto:${to}${q ? '?' + q : ''}`;
}

export function formatSms(phone = '', message = ''): string {
  return `smsto:${phone}:${message}`;
}

export function formatTel(phone = ''): string {
  return `tel:${phone.replace(/\s+/g, '')}`;
}

export function formatEvent(data: {
  title?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
}): string {
  const formatDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatDate(data.startDate || '');
  const end = formatDate(data.endDate || '');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${data.title || 'New Event'}`,
  ];

  if (start) lines.push(`DTSTART:${start}`);
  if (end) lines.push(`DTEND:${end}`);
  if (data.location) lines.push(`LOCATION:${data.location}`);
  if (data.description) lines.push(`DESCRIPTION:${data.description}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\n');
}

export function formatGeo(latitude: string | number = '', longitude: string | number = '', query = ''): string {
  if (query && (!latitude || !longitude)) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  return `geo:${latitude},${longitude}`;
}

export function formatWhatsApp(phone = '', message = ''): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = encodeURIComponent(message || '');
  return `https://wa.me/${cleanPhone}${text ? '?text=' + text : ''}`;
}

export function formatTelegram(username = '', text = ''): string {
  const cleanUser = username.replace(/^@/, '');
  return text ? `https://t.me/${cleanUser}?text=${encodeURIComponent(text)}` : `https://t.me/${cleanUser}`;
}

export function formatBitcoin(address = '', amount = '', label = '', message = ''): string {
  const params: string[] = [];
  if (amount) params.push(`amount=${amount}`);
  if (label) params.push(`label=${encodeURIComponent(label)}`);
  if (message) params.push(`message=${encodeURIComponent(message)}`);
  return `bitcoin:${address}${params.length > 0 ? '?' + params.join('&') : ''}`;
}

export function formatEthereum(address = '', valueEth = ''): string {
  if (valueEth) {
    // 1 ETH = 1e18 wei
    const wei = (parseFloat(valueEth) * 1e18).toString();
    return `ethereum:${address}?value=${wei}`;
  }
  return `ethereum:${address}`;
}

export function formatSolana(address = '', amount = ''): string {
  return amount ? `solana:${address}?amount=${amount}` : `solana:${address}`;
}

export function formatUpi(vpa = '', name = '', amount = '', note = ''): string {
  const params = new URLSearchParams();
  params.append('pa', vpa);
  if (name) params.append('pn', name);
  if (amount) params.append('am', amount);
  if (note) params.append('tn', note);
  params.append('cu', 'INR');
  return `upi://pay?${params.toString()}`;
}

export function formatPayPal(handle = '', amount = ''): string {
  const clean = handle.replace(/^https?:\/\/paypal\.me\//, '').replace(/^@/, '');
  return amount ? `https://paypal.me/${clean}/${amount}` : `https://paypal.me/${clean}`;
}

export function formatTotp(secret = '', issuer = '', account = ''): string {
  const cleanSecret = secret.replace(/\s+/g, '').toUpperCase();
  const acc = encodeURIComponent(account || 'User');
  const iss = encodeURIComponent(issuer || 'App');
  return `otpauth://totp/${iss}:${acc}?secret=${cleanSecret}&issuer=${iss}&algorithm=SHA1&digits=6&period=30`;
}
