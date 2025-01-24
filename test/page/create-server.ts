import http from 'http'
import express from 'express'
import { fileURLToPath } from 'url';

export function createServer(): Promise<http.Server>{
    const app = express();
    const staticContent = express.static(fileURLToPath(new URL('./src', import.meta.url)));
    app.use(staticContent);
    return new Promise((res, rej) => {
        const server = app.listen(8000, (err) => {
            if(err){
                rej(err);
                return;
            }
            res(server)
        })
    })
}