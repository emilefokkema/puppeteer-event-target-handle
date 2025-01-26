import { Page } from 'puppeteer'
import { EventTargetHandleFactory } from './event-target-handle-factory';

/**
 * Creates a factory for {@link EventTargetHandle}s.
 * 
 * @param page The {@link Page} containing the event targets for which to create handles.
 * @returns A Promise that will resolve to an {@link EventTargetHandleFactory}
 */
declare const createEventTargetHandleFactory: (page: Page) => Promise<EventTargetHandleFactory>;

export { createEventTargetHandleFactory };
export { EventTargetHandleFactory }
export { EventTargetLike } from '../../shared/api/event-target-like'
export { EventTargetHandle, ExtendedSerializedMap } from "./event-target-handle";
export { ChartMap, SerializablePropertyChart, SerializedValue } from '../../shared/api/serializable-types'