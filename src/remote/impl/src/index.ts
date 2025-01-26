import type { EventTargetHandleFactory } from 'api/event-target-handle-factory'
import type { EventTargetLike } from 'shared/api/event-target-like';
import type { ConnectionData } from 'shared/connection-data';
import { EventTargetHandleImpl } from './event-target-handle-impl';
import { getMessageTarget } from './get-message-target';

const factory: EventTargetHandleFactory = <TMap>(
    eventTargetLike: EventTargetLike<TMap>,
    connectionData: ConnectionData) => {
        const messageTarget = getMessageTarget(connectionData);
        return new EventTargetHandleImpl(messageTarget, eventTargetLike);
    }

export default factory;