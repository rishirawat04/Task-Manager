import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',  
  plugins: [react()],
  css: {
    postcss: false,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: '0.0.0.0',
  }
})
