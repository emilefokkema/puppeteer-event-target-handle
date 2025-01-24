import { createServer } from './page/create-server'

export default async function globalSetup(): Promise<() => Promise<void>> {
    const server = await createServer();
    return () => new Promise<void>((res, rej) => {
        server.close((err) => {
            if(err){
                rej(err);
                return;
            }
            res();
        })
    })
}