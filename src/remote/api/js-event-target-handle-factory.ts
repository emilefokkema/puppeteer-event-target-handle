import { EventTargetLike } from '../../shared/event-target-like'
import { ConnectionData } from '../../shared/connection-data'
import { JSEventTargetHandle } from "./js-event-target-handle";

export type JSEventTargetHandleFactory = <TMap>(
    eventTargetLike: EventTargetLike<TMap>,
    connection: ConnectionData) => JSEventTargetHandle<TMap>