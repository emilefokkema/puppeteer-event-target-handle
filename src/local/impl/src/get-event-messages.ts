import { ConnectionData } from '../../../shared/connection-data';
import { ConnectionEventMessage, EventMessage } from '../../../shared/messages';
import { EventSource } from './events/event-source'
import { map } from './events/map';

export function getEventMessages(
    connectionEventMessages: EventSource<ConnectionEventMessage>,
    connectionData: ConnectionData
): EventSource<EventMessage>{
    return map(connectionEventMessages, (emit) => ({connectionId, message}: ConnectionEventMessage) => {
        if(connectionId !== connectionData.id){
            return;
        }
        emit(message);
    })
}