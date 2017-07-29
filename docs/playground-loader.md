### Playground ⇆ Loader communication

The Cosmos UI is made out of two frames. Components are loaded inside an `iframe` for full encapsulation. Because the Playground and the Loader aren't part of the same frame, we use `postMessage` to communicate back and forth.

#### Playground to Loader

##### User selects fixture

```js
{
  type: 'fixtureSelect',
  component: 'Message',
  fixture: 'multiline'
}
```
##### User edits fixture body inside editor

```js
{
  type: 'fixtureEdit',
  fixtureBody: {
    // serializable stuff
  }
}
```

#### Loader to Playground

##### Loader frame loads and is ready to receive messages

Includes user fixture list. Happens once per full browser refresh.

```js
{
  type: 'loaderReady',
  fixtures: {
    ComponentA: ['fixture1', 'fixture2'],
  }
}
```

##### Fixture list updats due to changes on disk

webpack HMR updates Loader with the latest fixture list.

```js
{
  type: 'fixtureListUpdate',
  fixtures: {
    ComponentA: ['fixture1', 'fixture2', 'fixture3']
  }
}
```

##### Fixture loads

Serializable fixture body is attached, which the Playground uses for the fixture editor.

```js
{
  type: 'fixtureLoad',
  fixtureBody: {
    // serializable stuff
  }
}
```

##### Fixture updates

Due to state changes (local state, Redux or custom) or due to changes on disk (received by Loader via webpack HMR).

```js
{
  type: 'fixtureUpdate',
  fixtureBody: {
    // serializable stuff
  }
}
```

#### Order of events

Init:

1. Playground renders in loading state and Loader `<iframe>` is added to DOM
1. Loader renders inside iframe and sends `loaderReady` event to *window.parent*, along with user fixture list
1. Playground receives `loaderReady` event, puts fixture list in state and exits the loading state

Selecting fixture:

1. Playground sends `fixtureSelect` event to Loader with the selected component + fixture pair
1. Loader receives `fixtureSelect` and renders corresponding component fixture (wrapped in user configured Proxy chain)
1. User component renders, callback `ref` is bubbled up to Loader and `fixtureLoad` event is sent to Playground together with the serializable body of the selected fixture
1. Playground receives serializable fixture body, puts it in state and uses it as the JSON contents of the fixture editor
