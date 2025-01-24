import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { firstValueFrom, fromEvent } from 'rxjs'
import { Browser, launch, Page } from 'puppeteer'
import { createEventTargetHandleFactory, EventTargetHandle } from 'puppeteer-event-target-handle'

describe('an event target handle', () => {
    let browser: Browser;
    let page: Page;
    let windowEventTargetHandle: EventTargetHandle<GlobalEventHandlersEventMap, {}>

    beforeAll(async () => {
        browser = await launch();
        page = await browser.newPage();
        await page.goto('http://127.0.0.1:8000/');
        const factory = await createEventTargetHandleFactory(page);
        const windowHandle = await page.evaluateHandle(() => window);
        windowEventTargetHandle = await factory<GlobalEventHandlersEventMap>(windowHandle);
        
    })

    afterAll(async () => {
        await browser.close();
    })

    it('should emit a click event', async () => {
        const emittingClick = await windowEventTargetHandle.emitEvents({
            click: {
                offsetX: true,
                offsetY: true
            }
        })
        const eventPromise: Promise<{offsetX: number, offsetY: number}> = firstValueFrom(fromEvent(emittingClick, 'click'))
        await page.mouse.click(100, 100);
        const clickEvent = await eventPromise;
        expect(clickEvent).toEqual({
            offsetX: 100,
            offsetY: 100
        })
    })

    it('should emit a touchstart event', async () => {
        const emittingTouchStart = await windowEventTargetHandle.emitEvents({
            touchstart: {
                changedTouches: {0: {clientX: true, clientY: true}}
            }
        })
        const eventPromise: Promise<{
            changedTouches: {
                [key: number]: {clientX: number, clientY: number}
            }
        }> = firstValueFrom(fromEvent(emittingTouchStart, 'touchstart'));
        const touch = await page.touchscreen.touchStart(200, 200);
        const touchEvent = await eventPromise;
        await touch.end();
        expect(touchEvent).toEqual({
            changedTouches: {
                0: {
                    clientX: 200,
                    clientY: 200
                }
            }
        })
    })
})