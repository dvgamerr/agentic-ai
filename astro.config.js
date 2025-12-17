import { defineConfig } from 'astro/config'
import tailwind from '@tailwindcss/vite'
import svelte from '@astrojs/svelte'
import bun from '@nurodev/astro-bun'
import electron from 'astro-electron'

export default defineConfig({
  adapter: bun(),
  output: 'server',
  build: {
    assets: 'dist',
  },

  vite: {
    plugins: [tailwind()],
    server: {
      watch: {
        ignored: ['.github/**/*'],
      },
    },
  },
  security: {
    checkOrigin: false,
  },
  integrations: [
    svelte(),
    electron({
      main: { entry: 'src/electron/main.js', vite: {} },
      preload: { input: 'src/electron/preload.js' },
    }),
  ],
})
