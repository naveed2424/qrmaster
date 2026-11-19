import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function servePublicHtmlZipPlugin(): Plugin {
  return {
    name: 'serve-public-html-zip',
    configureServer(server) {
      server.middlewares.use('/download/2qrcode-public_html.zip', (_req, res, next) => {
        const zipPath = path.resolve(rootDir, '2qrcode-public_html.zip');
        if (!fs.existsSync(zipPath)) {
          return next();
        }
        const stat = fs.statSync(zipPath);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Length', String(stat.size));
        res.setHeader('Content-Disposition', 'attachment; filename="2qrcode-public_html.zip"');
        fs.createReadStream(zipPath).pipe(res);
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), servePublicHtmlZipPlugin()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(rootDir, 'index.html'),
          video: path.resolve(rootDir, 'video.html'),
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('lucide-react')) {
                return 'icons-vendor';
              }
              if (id.includes('qrcode') || id.includes('jszip') || id.includes('canvas-confetti')) {
                return 'qr-tools-vendor';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
