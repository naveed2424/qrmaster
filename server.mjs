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

// SPA fallback for client-side routes
app.use((_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(distIndex);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[2qrcode.com] Production server running on http://0.0.0.0:${port}`);
});
