import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/alphalearn/',
  build: {
    // iPad 7 (iPadOS 13) : empêche le minifieur de produire du CSS trop récent
    // (inset, media queries « width<=… »)
    cssTarget: 'safari13',
  },
})
