import { ChartMap, SerializablePropertyChart, SerializedValue } from '../../shared/serializable-types'
import { EventTargetLike } from '../../shared/event-target-like'

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

export interface JSEventTargetHandle<TMap, TSerializedMap = {}> extends EventTargetLike<Pick<TSerializedMap, keyof TMap & keyof TSerializedMap>> {
    emitEvents<TChartMap extends ChartMap<TMap>>(map: TChartMap): Promise<JSEventTargetHandle<TMap, ExtendedSerializedMap<TMap, TSerializedMap, TChartMap>>>
    handleEvents<TType extends (keyof TMap & keyof TSerializedMap)>(
        type: TType,
        addHandler: (handlerAdder: (handler: (e: TMap[TType]) => void) => void) => void
    ): Promise<void>
    switchToCapture(type: keyof TMap & keyof TSerializedMap): Promise<void>
}