# What?

This package makes DOM events available to Puppeteer.

> [!NOTE]  
> A [proposal](https://github.com/puppeteer/puppeteer/issues/13561) exists to make (some form of) the functionality in this package a part of Puppeteer itself.

## I mean, what problem does it solve?

Sometimes, when using [Puppeteer](https://pptr.dev/), one would like to interact with DOM events. For example, suppose we have a `JSHandle` for a button element. This button emits `'click'` events. Now, if we wanted to access those events in the context of Puppeteer, we would have to do something like
```ts
await buttonHandle.evaluate(button => {
    button.addEventListener('click', e => { 
        // do something with `e`, such as store properties of it somewhere
    })
})
```
and then, once we know that some `'click'` event has been emitted by the button, retrieve the relevant information from the page using another `evaluate()`-like call. This is cumbersome.

## A solution

Create an object that emits the button's `'click'` events in the Puppeteer context.

### Meaning?
This package allows you to do the following:
```ts
// Assuming `factory` is a function that produces EventTargetHandles. More on that below.
// Also assuming that `buttonHandle` is a JSHandle from Puppeteer.
const buttonEventTargetHandle = await factory<{click: MouseEvent}>(buttonHandle);
// Tell this EventTargetHandle to start listening to `'click'` events and emit them
const emittingButtonClicks = await buttonEventTargetHandle.emitEvents({
    click: {
        // these are the properties of the `'click'` event that we're interested in.
        offsetX: true,
        offsetY: true
    }
});
// And now we can listen!
emittingButtonClicks.addEventListener('click', e => {
    // and here we know that `e` has properties `offsetX` and `offsetY`, both of which are `number`s
})
```

### So what about that `factory`?

Well, you can get it from a Puppeteer [`Page`](https://pptr.dev/api/puppeteer.page) by doing this:
```ts
import { createEventTargetHandleFactory } from 'puppeteer-event-target-handle'

// assuming we have a Puppeteer Page called `page`
const factory = await createEventTargetHandleFactory(page)
```

### What about event properties that cannot be transferred to the Puppeteer context?

For example functions such as [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault). They can still be accessed like this:
```ts
emittingButtonClicks.handleEvents('click', h => h(e => e.preventDefault()));
```
This will make sure that any `'click'` event emitted by `emittingButtonClicks` will have been handled by that handler before being passed to Puppeteer.
