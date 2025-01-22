import { JSHandle } from 'puppeteer'
import { EventTargetLike } from '../../../shared/event-target-like'
import { EventTargetHandle } from '../../api/event-target-handle'
import { EventTargetHandleFactory } from '../../../remote/api/event-target-handle-factory'
import { ConnectionDataRepository } from './connection-data-repository'

import { EventSource } from './events/event-source'
import { ConnectionEventMessage } from '../../../shared/messages'
import { ExposedFunctionConnection } from './exposed-function-connection'
import { EventTargetHandleImpl } from './event-target-handle-impl'

export async function createEventTargetHandle<TMap>(
    factoryHandle: JSHandle<EventTargetHandleFactory>,
    target: JSHandle<EventTargetLike<TMap>>,
    connectionDataRepository: ConnectionDataRepository,
    connectionEventMessages: EventSource<ConnectionEventMessage>    
): Promise<EventTargetHandle<TMap>>{
        const connectionData = connectionDataRepository.create();
        const eventTargetHandle = await factoryHandle.evaluateHandle(
            (factory, target, connection) => factory(target, connection),
            target,
            connectionData
        );
        const connection = new ExposedFunctionConnection(
            connectionEventMessages,
            connectionData
        )
        return new EventTargetHandleImpl<TMap, {}>(
            connection,
            eventTargetHandle,
            {}
        )
}