import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/alphalearn/',
  build: {
    // Vieux iPad : iPad 7 (cible) et iPad Mini 2 (témoin, iOS 12 / Safari 12).
    // Sans ça, Vite produit du JS trop récent (?., ??, ??=) : page blanche sur Safari 12.
    target: 'safari12',
    // CSS : empêche le minifieur de produire inset, media queries « width<=… », etc.
    cssTarget: 'safari12',
  },
})
