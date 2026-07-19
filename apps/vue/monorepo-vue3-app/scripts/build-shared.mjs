import { copyFile, mkdir, readdir, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { build } from 'vite'

const require = createRequire(import.meta.url)
const rootDir = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const sharedOutDir = path.resolve(rootDir, 'dist/shared')

const internalPackages = [
  {
    name: 'constants',
    entry: 'packages/constants/src/index.ts',
  },
  {
    name: 'utils',
    entry: 'packages/utils/src/index.ts',
  },
  {
    name: 'api',
    entry: 'packages/api/src/index.ts',
    external: ['@monorepo-vue3-app/constants', '@monorepo-vue3-app/utils'],
  },
  {
    name: 'ui',
    entry: 'packages/ui/src/shared.ts',
    external: ['vue', '@monorepo-vue3-app/constants', '@monorepo-vue3-app/utils'],
    plugins: [vue()],
  },
]

const vendorFiles = [
  {
    from: 'vue/dist/vue.runtime.esm-browser.prod.js',
    to: 'vendor/vue.runtime.esm-browser.prod.js',
  },
]

async function buildInternalPackage(pkg) {
  const outDir = path.resolve(sharedOutDir, 'packages', pkg.name)

  await build({
    configFile: false,
    root: rootDir,
    plugins: pkg.plugins ?? [],
    build: {
      emptyOutDir: true,
      outDir,
      sourcemap: false,
      cssCodeSplit: true,
      lib: {
        entry: path.resolve(rootDir, pkg.entry),
        formats: ['es'],
        fileName: () => 'index.js',
        cssFileName: 'style',
      },
      rollupOptions: {
        external: pkg.external ?? [],
      },
    },
  })

  if (pkg.name === 'ui') {
    await normalizeUiCssName(outDir)
  }
}

async function normalizeUiCssName(outDir) {
  const files = await readdir(outDir)
  const cssFile = files.find((file) => file.endsWith('.css'))

  if (cssFile && cssFile !== 'style.css') {
    await rename(path.resolve(outDir, cssFile), path.resolve(outDir, 'style.css'))
  }
}

async function copyVendorFile(file) {
  const from = require.resolve(file.from, { paths: [path.resolve(rootDir, 'apps/admin')] })
  const to = path.resolve(sharedOutDir, file.to)

  await mkdir(path.dirname(to), { recursive: true })
  await copyFile(from, to)
}

await rm(sharedOutDir, { recursive: true, force: true })

for (const pkg of internalPackages) {
  await buildInternalPackage(pkg)
}

for (const file of vendorFiles) {
  await copyVendorFile(file)
}

console.log(`Shared runtime assets generated at ${path.relative(rootDir, sharedOutDir)}`)
