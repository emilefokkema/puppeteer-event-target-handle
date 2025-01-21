import { JSHandle } from "puppeteer";
import { EventTargetLike } from '../../shared/event-target-like'
import { EventTargetHandle } from "./event-target-handle";

export type EventTargetHandleFactory = <TMap>(target: JSHandle<EventTargetLike<TMap>>) => Promise<EventTargetHandle<TMap>>