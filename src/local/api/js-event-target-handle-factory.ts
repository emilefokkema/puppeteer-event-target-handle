import { JSHandle } from "puppeteer";
import { EventTargetLike } from '../../shared/event-target-like'
import { JSEventTargetHandle } from "./js-event-target-handle";

export type JSEventTargetHandleFactory = <TMap>(target: JSHandle<EventTargetLike<TMap>>) => Promise<JSEventTargetHandle<TMap>>