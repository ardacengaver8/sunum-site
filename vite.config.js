import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base './' keeps asset paths relative, so the build works under any
// GitHub Pages repo path (user.github.io/<repo>/).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
