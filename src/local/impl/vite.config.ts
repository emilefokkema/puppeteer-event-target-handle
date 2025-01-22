import { defineConfig, LibraryFormats } from 'vite'
import { fileURLToPath } from "url";

const entryPath = fileURLToPath(new URL('./src/index.ts', import.meta.url))
const distPath = fileURLToPath(new URL('../../../dist', import.meta.url))
export default defineConfig(() => {
    return {
        build: {
            lib: {
                entry: entryPath,
                formats: ['es' as LibraryFormats],
                fileName: 'index'
            },
            outDir: distPath,
            emptyOutDir: false
        }
    }
})