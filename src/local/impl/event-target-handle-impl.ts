import { JSHandle } from 'puppeteer'
import { EventTargetHandle, ExtendedSerializedMap } from '../api/event-target-handle'
import { EventTargetHandle as RemoteEventTargetHandle } from '../../remote/api/event-target-handle'
import { ChartMap } from '../../shared/serializable-types'
import { TargetEventListener } from './target-event-listener'
import { Connection } from './connection'

type ListenerMap<TMap, TSerializedMap> = {[key in (keyof TSerializedMap & keyof TMap)]: TargetEventListener<TSerializedMap[key], key>};


function create<TMap, TSerializedMap>(
    connection: Connection,
    runtimeEventTargetHandle: JSHandle<RemoteEventTargetHandle<TMap>>,
    listeners: ListenerMap<TMap, TSerializedMap>
): EventTargetHandle<TMap, TSerializedMap>{
    return new EventTargetHandleImpl(connection, runtimeEventTargetHandle, listeners)
}
export class EventTargetHandleImpl<TMap, TSerializedMap> implements EventTargetHandle<TMap, TSerializedMap>{
    public constructor(
        private readonly connection: Connection,
        private readonly runtimeEventTargetHandle: JSHandle<RemoteEventTargetHandle<TMap>>,
        private readonly listeners: ListenerMap<TMap, TSerializedMap>
    ){}
    public addEventListener<TType extends (keyof TSerializedMap & keyof TMap)>(type: TType, listener: (e: TSerializedMap[TType]) => void): void {
        const eventListener = this.listeners[type];
        if(!eventListener){
            return;
        }
        eventListener.addListener(listener);
    }
    public removeEventListener<TType extends (keyof TSerializedMap & keyof TMap)>(type: TType, listener: (e: TSerializedMap[TType]) => void): void {
        const eventListener = this.listeners[type];
        if(!eventListener){
            return;
        }
        eventListener.removeListener(listener)
    }
    public async emitEvents<TChartMap extends ChartMap<TMap>>(
        map: TChartMap
    ): Promise<EventTargetHandle<TMap, ExtendedSerializedMap<TMap, TSerializedMap, TChartMap>>>{
        const eventMessages = this.connection.getEventMessages();
        await this.runtimeEventTargetHandle.evaluate((t, map) => t.emitEvents(map as ChartMap<TMap>), map);
        const addedListeners: {
            [type in keyof TChartMap]?: TargetEventListener<unknown, type>
        } = {};
        for(const type in map){
            const listener = new TargetEventListener(eventMessages, type);
            addedListeners[type] = listener;
        }
        const newListeners = {...this.listeners, ...addedListeners} as ListenerMap<TMap, ExtendedSerializedMap<TMap, TSerializedMap, TChartMap>>
        return create(this.connection, this.runtimeEventTargetHandle, newListeners)
    }

    public switchToCapture(type: keyof TMap & keyof TSerializedMap): Promise<void> {
        return this.runtimeEventTargetHandle.evaluate((t, type) => t.switchToCapture(type as keyof TMap), type)
    }

    public async handleEvents<TType extends (keyof TMap & keyof TSerializedMap)>(
        type: TType,
        addHandler: (handlerAdder: (handler: (e: TMap[TType]) => void) => void) => void
    ): Promise<void>{
        const callbackHandle = await this.runtimeEventTargetHandle.evaluateHandle(
            (ret, type) => (handler: (e: TMap[TType]) => void) => ret.handleEvents(type as keyof TMap, handler),
            type
        )
        return callbackHandle.evaluate(addHandler);
    }
}