import type { ConnectionData } from "shared/connection-data";
import type { EventMessage } from "shared/messages";
import type { MessageTarget } from "./message-target";

export function getMessageTarget(connectionData: ConnectionData): MessageTarget {
    return {
        send(message: EventMessage): void{
            window.eventTargetHandleSendEvent({
                connectionId: connectionData.id,
                message
            })
        }
    }
}