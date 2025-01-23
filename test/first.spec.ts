import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Browser, launch, Page } from 'puppeteer'
import { createEventTargetHandleFactory, EventTargetHandle } from 'puppeteer-event-target-handle'

describe('when this', () => {
    let browser: Browser;
    let page: Page;
    let windowEventTargetHandle: EventTargetHandle<GlobalEventHandlersEventMap, {}>

    beforeAll(async () => {
        browser = await launch();
        page = await browser.newPage();
        const factory = await createEventTargetHandleFactory(page);
        const windowHandle = await page.evaluateHandle(() => window);
        windowEventTargetHandle = await factory<GlobalEventHandlersEventMap>(windowHandle);
        
    })

    afterAll(async () => {
        await browser.close();
    })

    it('should', async () => {
        let clickEvent: {offsetX: number, offsetY: number};
        const emittingClick = await windowEventTargetHandle.emitEvents({
            click: {
                offsetX: true,
                offsetY: true
            }
        })
        emittingClick.addEventListener('click', e => clickEvent = e)
        await page.mouse.click(100, 100);
        expect(clickEvent).toEqual({})
    })
})