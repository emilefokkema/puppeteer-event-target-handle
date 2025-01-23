import { fileURLToPath } from "url";
import path from 'path'

export const distPath = fileURLToPath(new URL('./dist', import.meta.url));
export const distIndexPath = path.resolve(distPath, 'index.js');
