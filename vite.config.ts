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
              // Check in root ./kennzeichen_game first, then ./public/kennzeichen_game
              const rootPath = path.resolve(__dirname, 'kennzeichen_game', relPath);
              const publicPath = path.resolve(__dirname, 'public', 'kennzeichen_game', relPath);

              const targetFile = fs.existsSync(rootPath) ? rootPath : fs.existsSync(publicPath) ? publicPath : null;

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
        '@': path.resolve(__dirname, '.'),
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
