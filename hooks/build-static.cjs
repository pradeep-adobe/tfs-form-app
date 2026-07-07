const { execSync } = require('node:child_process')
const { cpSync, mkdirSync, rmSync } = require('node:fs')
const path = require('node:path')

module.exports = async () => {
  const root = path.resolve(__dirname, '..')
  const outDir = path.join(root, 'dist', 'web-prod')
  const bundleSrc = path.join(root, 'dist', 'tfs-form.iife.js')

  execSync('npm run build', { stdio: 'inherit', cwd: root })

  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  cpSync(bundleSrc, path.join(outDir, 'tfs-form.iife.js'))
  cpSync(path.join(root, 'web', 'index.html'), path.join(outDir, 'index.html'))

  // Truthy return skips Parcel so our pre-built bundle is not wiped or re-hashed.
  return true
}
