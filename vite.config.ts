import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function generateCloudflareRoutesPlugin(): Plugin {
  let rootDir = process.cwd();
  let outDir = 'dist';

  return {
    name: 'generate-cloudflare-routes',
    apply: 'build',
    configResolved(config) {
      rootDir = config.root;
      outDir = config.build.outDir;
    },
    closeBundle() {
      const resolvedOutDir = path.resolve(rootDir, outDir);
      if (!fs.existsSync(resolvedOutDir)) {
        fs.mkdirSync(resolvedOutDir, { recursive: true });
      }

      const routesConfig = {
        version: 1,
        include: ['/*'],
        exclude: [],
      };

      fs.writeFileSync(
        path.join(resolvedOutDir, '_routes.json'),
        JSON.stringify(routesConfig, null, 2) + '\n',
        'utf-8'
      );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), generateCloudflareRoutesPlugin()],
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
