import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { VitePWA } from 'vite-plugin-pwa' // Import the VitePWA plugin manually
import vueDevTools from 'vite-plugin-vue-devtools'
// import { visualizer } from 'rollup-plugin-visualizer' // Import the visualizer plugin (3rd party)

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true // Global import for Test imports (no need to import them in each test file)
  },
  plugins: [
    vue(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true
    //   },
    //   manifest: {
    //     name: 'Music Player App',
    //     theme_color: '#fffe3a',
    //     icons: [
    //       {
    //         src: 'assets/img/icons/msapplication-icon-144x144.png',
    //         sizes: '144x144',
    //         type: 'image/png'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     // Package that searches for files with patterns and caches them
    //     // globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,json}']
    //     globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,}']
    //   }
    // }),
    // This plugin doesn't run during 'dev' mode, it's exlusive for 'build' mode
    // visualizer({ open: true }), // This is the plugin that will generate the visualizer report
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
