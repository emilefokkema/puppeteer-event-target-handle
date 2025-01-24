import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { firstValueFrom, fromEvent, Observable } from 'rxjs'
import { Browser, ElementHandle, launch, Page } from 'puppeteer'
import { createEventTargetHandleFactory, EventTargetHandle } from 'puppeteer-event-target-handle'

interface SerializableClickEvent {
    offsetX: number
    offsetY: number
}

interface SerializableTouchEvent {
    changedTouches: {[key: number]: {clientX: number, clientY: number}}
}

describe('an event target handle', () => {
    let browser: Browser;
    let page: Page;
    let windowEventTargetHandle: EventTargetHandle<GlobalEventHandlersEventMap, {
        click: SerializableClickEvent,
        touchstart: SerializableTouchEvent
    }>;
    let windowClickEvents: Observable<SerializableClickEvent>;
    let windowTouchStartEvents: Observable<SerializableTouchEvent>
    let checkboxHandle: ElementHandle;
    let checkboxEventTargetHandle: EventTargetHandle<GlobalEventHandlersEventMap, {
        click: SerializableClickEvent
    }>

    beforeAll(async () => {
        browser = await launch({args: ['--no-sandbox']});
        page = await browser.newPage();
        await page.goto('http://127.0.0.1:8000/');
        const eventTargetHandleFactory = await createEventTargetHandleFactory(page);
        const windowHandle = await page.evaluateHandle(() => window);
        checkboxHandle = await page.evaluateHandle(() => document.getElementById('checkbox'));
        windowEventTargetHandle = await eventTargetHandleFactory<GlobalEventHandlersEventMap>(windowHandle)
            .then(eth => eth.emitEvents({
                click: {
                    offsetX: true,
                    offsetY: true
                },
                touchstart: {
                    changedTouches: {
                        0: {
                            clientX: true,
                            clientY: true
                        }
                    }
                }
            }));
        windowClickEvents = fromEvent<SerializableClickEvent>(windowEventTargetHandle, 'click');
        windowTouchStartEvents = fromEvent<SerializableTouchEvent>(windowEventTargetHandle, 'touchstart')
        checkboxEventTargetHandle = await eventTargetHandleFactory<GlobalEventHandlersEventMap>(checkboxHandle)
            .then(eth => eth.emitEvents({
                click: {
                    offsetX: true,
                    offsetY: true
                }
            }))
        
    })

    afterAll(async () => {
        await browser.close();
    })

    it('should emit a click event', async () => {
        const eventPromise = firstValueFrom(windowClickEvents)
        await page.mouse.click(100, 100);
        const clickEvent = await eventPromise;
        expect(clickEvent).toEqual({
            offsetX: 100,
            offsetY: 100
        })
    })

    it('should emit a touchstart event', async () => {
        const eventPromise = firstValueFrom(windowTouchStartEvents);
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

    it('should listen on capture and add remote handler', async () => {
        const checkboxClickHandler = vi.fn();
        checkboxEventTargetHandle.addEventListener('click', checkboxClickHandler);
        await windowEventTargetHandle.switchToCapture('click');
        await windowEventTargetHandle.handleEvents('click', h => h(e => e.stopPropagation()));
        await Promise.all([
            firstValueFrom(windowClickEvents),
            checkboxHandle.click()
        ])
        expect(checkboxClickHandler).not.toHaveBeenCalled();
    })
})