import { Page } from 'puppeteer'
import { EventTargetHandleFactory } from './event-target-handle-factory';

declare const createEventTargetHandleFactory: (page: Page) => Promise<EventTargetHandleFactory>;

export { createEventTargetHandleFactory };