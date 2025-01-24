import { Page } from 'puppeteer'
import { EventTargetHandleFactory } from './event-target-handle-factory';

declare const createEventTargetHandleFactory: (page: Page) => Promise<EventTargetHandleFactory>;

export { createEventTargetHandleFactory };
export { EventTargetHandleFactory }
export { EventTargetLike } from '../../shared/api/event-target-like'
export { EventTargetHandle } from "./event-target-handle";
export { ChartMap, SerializablePropertyChart, SerializedValue } from '../../shared/api/serializable-types'