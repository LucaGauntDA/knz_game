import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-kennzeichen-game-root',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.startsWith('/kennzeichen_game/')) {
              const fs = require('fs');
              const relPath = decodeURIComponent(req.url.replace('/kennzeichen_game/', ''));
              const projectRoot = process.cwd();
              const rootPath = path.resolve(projectRoot, 'kennzeichen_game', relPath);
              const publicPath = path.resolve(projectRoot, 'public', 'kennzeichen_game', relPath);

              const targetFile = fs.existsSync(rootPath) ? rootPath : fs.existsSync(publicPath) ? publicPath : null;

              if (req.url === '/kennzeichen_game/manifest.json') {
                try {
                  const { scanDirectories } = require('./scripts/scan_kennzeichen');
                  const manifest = scanDirectories();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(manifest, null, 2));
                  return;
                } catch (e) {
                  // fallback to static file if error
                }
              }

              if (targetFile && fs.statSync(targetFile).isFile()) {
                res.setHeader('Content-Type', targetFile.endsWith('.json') ? 'application/json' : 'image/jpeg');
                fs.createReadStream(targetFile).pipe(res);
                return;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
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
