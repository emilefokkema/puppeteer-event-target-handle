import { EventTargetLike } from '../../shared/event-target-like'
import { ConnectionData } from '../../shared/connection-data'
import { EventTargetHandle } from "./event-target-handle";

export type EventTargetHandleFactory = <TMap>(
    eventTargetLike: EventTargetLike<TMap>,
    connection: ConnectionData) => EventTargetHandle<TMap>