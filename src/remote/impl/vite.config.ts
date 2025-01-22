import { defineConfig, LibraryFormats } from 'vite'
import { distPath } from './constants'
import { fileURLToPath } from 'url'

const entryPath = fileURLToPath(new URL('./src/index.ts', import.meta.url))
export default defineConfig(() => {
    return {
        build: {
            lib: {
                entry: entryPath,
                formats: ['es' as LibraryFormats],
                fileName: 'index'
            },
            outDir: distPath
        }
    }
})