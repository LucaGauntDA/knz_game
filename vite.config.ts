import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function directPlateImageMiddleware() {
  return {
    name: 'direct-plate-image-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const reqPath = (req.url || '').split('?')[0];
        if (!/^\/[^/]+\.(jpe?g|png|webp)$/i.test(reqPath)) {
          return next();
        }
        const filename = reqPath.slice(1);
        const publicDirect = path.resolve(process.cwd(), 'public', filename);
        if (fs.existsSync(publicDirect)) {
          return next();
        }
        const gameRoot = path.resolve(process.cwd(), 'public', 'kennzeichen_game');
        if (fs.existsSync(gameRoot)) {
          const folders = fs.readdirSync(gameRoot, { withFileTypes: true });
          for (const folder of folders) {
            if (!folder.isDirectory()) continue;
            const folderPath = path.join(gameRoot, folder.name);
            const candidate = path.join(folderPath, filename);
            if (fs.existsSync(candidate)) {
              const ext = path.extname(candidate).toLowerCase();
              const mime =
                ext === '.png'
                  ? 'image/png'
                  : ext === '.webp'
                  ? 'image/webp'
                  : 'image/jpeg';
              res.setHeader('Content-Type', mime);
              fs.createReadStream(candidate).pipe(res);
              return;
            }
            const files = fs.readdirSync(folderPath);
            const caseMatch = files.find((f) => f.toLowerCase() === filename.toLowerCase());
            if (caseMatch) {
              const matchedPath = path.join(folderPath, caseMatch);
              const ext = path.extname(matchedPath).toLowerCase();
              const mime =
                ext === '.png'
                  ? 'image/png'
                  : ext === '.webp'
                  ? 'image/webp'
                  : 'image/jpeg';
              res.setHeader('Content-Type', mime);
              fs.createReadStream(matchedPath).pipe(res);
              return;
            }
          }
        }
        return next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), directPlateImageMiddleware()],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.css'],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: false,
  },
});
