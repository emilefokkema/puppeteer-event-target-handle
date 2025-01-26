/**
 * Describes the behavior that a remote object should implement in order for an EventTargetHandle to be able to be created for it.
 * It also describes some of the behavior of an EventTargetHandle itself.
 */
export interface EventTargetLike<TEventMap>{
    addEventListener<TType extends keyof TEventMap>(type: TType, listener: (e: TEventMap[TType]) => void, capture?: boolean): void
    removeEventListener<TType extends keyof TEventMap>(type: TType, listener: (e: TEventMap[TType]) => void, capture?: boolean): void
}