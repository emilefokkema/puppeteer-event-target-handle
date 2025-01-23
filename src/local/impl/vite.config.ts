import { defineConfig, LibraryFormats } from 'vite'
import { fileURLToPath } from "url";
import { readFileSync } from 'fs';
import path from 'path'
import { distIndexPath as remoteDistIndexPath } from '../../remote/impl/constants'

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
        },
        define: {
            REMOTE_CODE: JSON.stringify(readFileSync(remoteDistIndexPath, {encoding: 'utf-8'}))
        }
    }
})