import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    // Dev server port
    port: 3456
  },
  // URL subpath when published to Github pages.
  // i.e. https://streamlit.github.io/mintaka/
  base: '/mintaka/',
  test: {
    environment: 'jsdom',
    setupFiles: [
      'testSetup.js',
    ],
  },
})
