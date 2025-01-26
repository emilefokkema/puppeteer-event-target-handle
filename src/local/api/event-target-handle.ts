import { ChartMap, SerializablePropertyChart, SerializedValue } from '../../shared/api/serializable-types'
import { EventTargetLike } from '../../shared/api/event-target-like'

/**
 * A type that describes the TSerializedMap of an {@link EventTargetHandle} that is the result of calling
 * {@link EventTargetHandle.emitEvents} with an argument of type TChartMap
 * @template TMap the event map of the original {@link EventTargetHandle}
 * @template TSerializedMap the TSerializedMap of the original {@link EventTargetHandle}
 * @template TChartMap the type of the argument to EventTargetHandle.emitEvents
 */
export type ExtendedSerializedMap<
    TMap,
    TSerializedMap,
    TChartMap extends ChartMap<TMap>
    > = TSerializedMap & {
        [type in (keyof TChartMap & keyof TMap)]:
            TChartMap[type] extends SerializablePropertyChart<TMap[type]>
            ? SerializedValue<TMap[type], TChartMap[type]>
            : never
    }

/**
 * Represents a handle to a remote object that emits events.
 * @template TMap an event map for the events that are emitted by the remote object
 * @template TSerializedMap an event map for the events that are emitted by this EventTargetHandle
 */
export interface EventTargetHandle<TMap, TSerializedMap = {}> extends EventTargetLike<Pick<TSerializedMap, keyof TMap & keyof TSerializedMap>> {
    /**
     * Configures the EventTargetHandle to listen for events on the remote object and emit them in the
     * Puppeteer context.
     * @param map an object that describes the events to emit and the properties of those events that are to be emitted
     * @returns this same EventTargetHandle, only typed so as to reflect the events that are now emitted.
     * @example
     * // assuming `page` is a Puppeteer `Page`, create a JSHandle for the window object
     * const windowHandle = await page.evaluateHandle(() => window);
     * // assuming `factory` is an EventTargetHandleFactory, create an event target handle for the window object
     * const eventTargetHandle = await factory<{click: MouseEvent}>(windowHandle);
     * const handleEmittingClick = await eventTargetHandle.emitEvents({
     *   // listen to `click` events on the remote object and emit the values for `offsetX` and `offsetY` in the Puppeteer context
     *   click: {
     *     offsetX: true,
     *     offsetY: true
     *   }
     * })
     */
    emitEvents<TChartMap extends ChartMap<TMap>>(map: TChartMap): Promise<EventTargetHandle<TMap, ExtendedSerializedMap<TMap, TSerializedMap, TChartMap>>>
    /**
     * Add an event handler to the remote object.
     * @param type the type of event for which to add a handler
     * @param addHandler a callback that receives as first argument a setter-like function that accepts the handler to add.
     * (This roundabout construction is due to the fact that the handler should execute in the remote context.)
     * @example
     * // Assuming `eventTargetHandle` emits `click` events, add a handler that calls `preventDefault()`
     * await eventTargetHandle.handleEvents('click', h => h(e => e.preventDefault()));
     */
    handleEvents<TType extends (keyof TMap & keyof TSerializedMap)>(
        type: TType,
        addHandler: (handlerAdder: (handler: (e: TMap[TType]) => void) => void) => void
    ): Promise<void>
    /**
     * For event of type `type`, attach the listener to the capturing phase instead of to the bubbling phase.
     * @param type the type of event for which to switch the handler from the bubbling to the capturing phase.
     */
    switchToCapture(type: keyof TMap & keyof TSerializedMap): Promise<void>
}