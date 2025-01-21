import type { JSEventTargetHandleFactory } from '../../api/js-event-target-handle-factory'
import type { EventTargetLike } from '../../../shared/event-target-like';
import type { ConnectionData } from '../../../shared/connection-data';
import { ExposedFunctionConnection } from './exposed-function-connection';
import { EventTargetHandleImpl } from './event-target-handle-impl';

const factory: JSEventTargetHandleFactory = <TMap>(
    eventTargetLike: EventTargetLike<TMap>,
    connectionData: ConnectionData) => {
        const connection = new ExposedFunctionConnection(connectionData);
        return new EventTargetHandleImpl(connection, eventTargetLike);
    }

export default factory;