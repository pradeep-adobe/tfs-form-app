import { createServer } from 'node:https'
import { readFile, stat } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { extname, join, normalize } from 'node:path'

// Minimal static HTTPS server with permissive CORS. It serves the built
// microfrontend bundle (dist/tfs-form.iife.js) so both the EDS site and the
// Universal Editor extension can load it during local development.
const distDir = fileURLToPath(new URL('./dist', import.meta.url))
const PORT = Number(process.env.PORT) || 3001

const options = {
  key: readFileSync(fileURLToPath(new URL('./certs/key.pem', import.meta.url))),
  cert: readFileSync(fileURLToPath(new URL('./certs/cert.pem', import.meta.url))),
}

const CONTENT_TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
}

createServer(options, async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
    const safeRel = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
    let filePath = join(distDir, safeRel)

    const info = await stat(filePath).catch(() => null)
    if (info && info.isDirectory()) filePath = join(filePath, 'index.html')

    const data = await readFile(filePath)
    res.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(filePath)] || 'application/octet-stream',
    })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found. Run `npm run build` (or `npm run watch`) to generate dist/.')
  }
}).listen(PORT, 'localhost', () => {
  // eslint-disable-next-line no-console
  console.log(`tfs-form-app serving https://localhost:${PORT}/tfs-form.iife.js`)
})
