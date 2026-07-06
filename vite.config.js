import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Reused self-signed certs so the bundle can be served over HTTPS. This lets
// the HTTPS Universal Editor extension (localhost:9080) load it without mixed
// content, while the HTTP EDS site (localhost:3000) can load it too.
const https = {
  key: readFileSync(fileURLToPath(new URL('./certs/key.pem', import.meta.url))),
  cert: readFileSync(fileURLToPath(new URL('./certs/cert.pem', import.meta.url))),
}

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Force React's production build for the shipped bundle so consumers don't
  // pull in dev-only warnings. Only applied on `vite build`.
  ...(command === 'build'
    ? { define: { 'process.env.NODE_ENV': JSON.stringify('production') } }
    : {}),
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/mount.jsx', import.meta.url)),
      name: 'TFSFormBundle',
      formats: ['iife'],
      fileName: () => 'tfs-form.iife.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    // Keep everything (React included) in a single self-contained file so the
    // block only needs to load one URL.
    rollupOptions: {
      output: { exports: 'named' },
    },
  },
  // `npm run dev:standalone` serves the demo harness for local development.
  server: {
    host: 'localhost',
    port: 3002,
    https,
    cors: true,
  },
}))
