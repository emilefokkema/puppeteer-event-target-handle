import { JSHandle } from "puppeteer";
import { EventTargetLike } from '../../shared/api/event-target-like'
import { EventTargetHandle } from "./event-target-handle";

/**
 * A function that creates an {@link EventTargetHandle} based on a {@link JSHandle} for an event target.
 * 
 * @template TMap the event map for the events emitted by the remote object.
 * @param target a {@link JSHandle} for an object that is (like) an event target.
 * @returns a Promise that will resolve to an {@link EventTargetHandle<TMap>}.
 */
export type EventTargetHandleFactory = <TMap>(target: JSHandle<EventTargetLike<TMap>>) => Promise<EventTargetHandle<TMap>>