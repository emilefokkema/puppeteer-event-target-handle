import { JSHandle, Page } from 'puppeteer'
import { EventTargetHandleFactory } from '../../api/event-target-handle-factory';
import { EventTargetHandle } from '../../api/event-target-handle'
import { EventTargetHandleFactory as RemoteEventTargetHandleFactory } from '../../../remote/api/event-target-handle-factory';
import { createConnectionDataRepository } from './create-connection-data-repository';
import { getConnectionEventMessages } from './get-connection-event-messages';
import { EventTargetLike } from '../../../shared/event-target-like';
import { createEventTargetHandle } from './create-event-target-handle';

export async function createEventTargetHandleFactory(page: Page): Promise<EventTargetHandleFactory> {
    const moduleHandle = await page.evaluateHandle(`
(function(){
    const source = 'const foo = 9; export default foo;';
    const blob = new Blob([source], {type: 'text/javascript'});
    const url = URL.createObjectURL(blob);
    return import(url);
})();
        `) as JSHandle<{default: RemoteEventTargetHandleFactory}>;
    const factory = await moduleHandle.evaluateHandle(m => m.default);
    const connectionDataRepository = createConnectionDataRepository();
    const connectionEventMessages = await getConnectionEventMessages(page);
    return <TMap>(target: JSHandle<EventTargetLike<TMap>>): Promise<EventTargetHandle<TMap>> => createEventTargetHandle(
        factory,
        target,
        connectionDataRepository,
        connectionEventMessages
    )
}