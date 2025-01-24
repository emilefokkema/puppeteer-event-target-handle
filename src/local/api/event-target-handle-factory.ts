import { JSHandle } from "puppeteer";
import { EventTargetLike } from '../../shared/api/event-target-like'
import { EventTargetHandle } from "./event-target-handle";

export type EventTargetHandleFactory = <TMap>(target: JSHandle<EventTargetLike<TMap>>) => Promise<EventTargetHandle<TMap>>