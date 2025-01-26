import { ChartMap } from 'shared/api/serializable-types'

export interface EventTargetHandle<TMap> {
    emitEvents(map: ChartMap<TMap>): void
    handleEvents<TType extends keyof TMap>(type: TType, handler: (e: TMap[TType]) => void): void
    switchToCapture(type: keyof TMap): void
}