import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Browser, launch, Page } from 'puppeteer'
import { createEventTargetHandleFactory } from 'puppeteer-event-target-handle'

describe('when this', () => {
    let browser: Browser

    beforeAll(async () => {
        browser = await launch();
        const page = await browser.newPage();
        const factory = await createEventTargetHandleFactory(page);
        const windowHandle = await page.evaluateHandle(() => window);
        const eventTargetHandle = await factory<GlobalEventHandlersEventMap>(windowHandle);
        // try{
        //     const factory = await createEventTargetHandleFactory(page);
        // }catch(e){
        //     const b = 0;
        // }
        
    })

    afterAll(async () => {
        await browser.close();
    })

    it('should', () => {
        expect(true).toBe(true)
    })
})