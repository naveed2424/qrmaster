import express from 'express';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const distIndex = path.join(distDir, 'index.html');

// Automatically build dist/ if hosting platform launches npm start without running build first
if (!fs.existsSync(distIndex)) {
  const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  if (fs.existsSync(viteBin)) {
    console.log('[2qrcode.com] Building static production bundle...');
    execFileSync(process.execPath, [viteBin, 'build'], {
      cwd: __dirname,
      stdio: 'inherit',
    });
  } else {
    console.error('[2qrcode.com] Missing dist/index.html and vite binary.');
    process.exit(1);
  }
}

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Redirect /index.html cleanly to /
app.get('/index.html', (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(301, `/${qs}`);
});

// 301 Redirect clean vanity paths to canonical query routes
const vanityRedirects = {
  '/blog': '/?view=blog',
  '/batch': '/?view=batch',
  '/customizer': '/?view=customizer',
  '/converter': '/?view=converter',
  '/about': '/?view=about',
  '/faq': '/?view=faqs',
  '/faqs': '/?view=faqs',
  '/reviews': '/?view=reviews',
  '/contact': '/?view=contact',
  '/privacy': '/?view=privacy',
  '/privacy-policy': '/?view=privacy',
  '/cookies': '/?view=cookies',
  '/cookies-policy': '/?view=cookies',
  '/terms': '/?view=terms',
  '/terms-of-service': '/?view=terms',
  '/video': '/?view=video',
};

app.use((req, res, next) => {
  const cleanPath = req.path.length > 1 && req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
  const target = vanityRedirects[cleanPath.toLowerCase()];
  if (target) {
    res.redirect(301, target);
    return;
  }
  next();
});

// Serve content-hashed Vite bundles with long-term immutable caching
app.use(
  '/assets',
  express.static(path.join(distDir, 'assets'), {
    maxAge: '1y',
    immutable: true,
  })
);

// Serve static public files (ads.txt, robots.txt, sitemap.xml, favicon.svg, audio/, video/)
app.use(
  express.static(distDir, {
    index: 'index.html',
    setHeaders(res, filePath) {
      if (
        filePath.endsWith('.html') ||
        filePath.endsWith('ads.txt') ||
        filePath.endsWith('robots.txt') ||
        filePath.endsWith('sitemap.xml')
      ) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      }
    },
  })
);

// Dedicated video studio HTML entrypoint
app.get('/video.html', (_req, res) => {
  res.sendFile(path.join(distDir, 'video.html'));
});

// Root SPA entry with HTTP 200
app.get('/', (_req, res) => {
  res.status(200);
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(distIndex);
});

// Return true HTTP 404 for unknown paths (avoiding Soft-404 / duplicate canonicals)
app.use((req, res) => {
  if (/\.(js|css|map|png|jpg|jpeg|webp|svg|ico|woff2|mp4|mp3)$/i.test(req.path)) {
    res.status(404).end('Not found');
    return;
  }
  res.status(404);
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(distIndex);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[2qrcode.com] Production server running on http://0.0.0.0:${port}`);
});
