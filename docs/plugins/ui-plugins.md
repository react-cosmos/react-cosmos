# UI plugins

The Cosmos UI plugin system consists of an intricate web of "slots" and "plugs" that weave together with minimal knowledge of each other.

Though it will take some time to get familiar with the subtleties of the Cosmos UI plugin architecture, its core principles are simple and so is creating your first “Hello World”.

> **Note** The underlying `react-plugin` library isn't published yet due to time constraints but will be open sourced as a separate project in the future.

## Boilerplate

The `ui` field in [`cosmos.plugin.json`](./plugin-config.md) points to a module like this:

```js
import React from 'react';
import { createPlugin } from 'react-plugin';

const plugin = createPlugin({ name: 'magicPlugin' });

// We're plugging a React component into an existing slot called "coolSlot"
plugin.plug('coolSlot', () => {
  return <div>This is magic.</div>;
});

plugin.register();
```

## Plugin API

Slots and plugs make up for the render composition but there's more to UI plugins. To function as standalone UI abstractions that can interact in meaningful ways, UI plugins can also have individual configuration, private states, public methods and event handlers.

### `createPlugin`

These are the arguments supported when creating a plugin:

| Argument        | Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | UI plugin identifier.                                                                                                           |
| `defaultConfig` | Optional plain object config. Set via Cosmos config under `ui.plugins.{name}` and read privately via `PluginContext.getConfig`. |
| `initialState`  | Optional plain object state. Accessed privately via `PluginContext.getState` and `PluginContext.setState`.                      |
| `methods`       | Optional method handlers called by other plugins via `PluginContext.getMethodsOf`.                                              |

Once created, the plugin API allows registering UI plugs, as well as `onLoad` and event handlers.

#### `Plugin.plug`

Plug a React component into a [`<Slot>`](#slot):

```jsx
plugin.plug('slotName', () => {
  return <MyComponent />;
});
```

Plugs get access to the [`PluginContext`](#plugincontext):

```jsx
plugin.plug('slotName', ({ pluginContext }) => {
  return <MyComponent state={pluginContext.getState()} />;
});
```

Plugs can receive slot props, which allows slots to parameterize their plugs:

```jsx
plugin.plug('slotName', ({ slotProps }) => {
  return <MyComponent name={slotProps.name} />;
});
```

_Somewhere in another plugin..._

```jsx
<Slot name="slotName" slotProps={{ name: 'Sara' }} />
```

Plugs can receive `children` from their slot. This allows plugs to act as decorators:

```jsx
plugin.plug('slotName', ({ children }) => {
  return <MyDecorator>{children}</MyDecorator>;
});
```

Additionally, when multiple plugs are registered for the same slot they can compose each other. The first plug will be `children` for the second plug, the first plug wrapped in the second will be `children` for the third plug, and so on.

You can also choose _not_ to render `children` in a plug, thereby ignoring the slot's children and replacing all previous plugs.

#### `Plugin.namedPlug`

Plug a React component into an [`<ArraySlot>`](#arrayslot):

```jsx
plugin.namedPlug('slotName', 'plugName', () => {
  return <MyComponent />;
});
```

Contrary to `Plugin.plug` where a plug decorates or replaces previous plugs, a named plug is appended to a list for the slot to render. Multiple named plugs are allowed for the same slot and all will be rendered independently.

> Named plugs are rendered in the order they are registered, or based on the optional `plugOrder` prop of the `ArraySlot` component.

#### `Plugin.onLoad`

Register a handler that gets called once when the Cosmos UI loads, or when the plugin is enabled. If the handler returns a callback it will be called when the plugin is disabled or uninstalled.

```js
plugin.onLoad(pluginContext => {
  // Add DOM event or fetch external data
  return () => {
    // Optional: Clean up and unsubscribe from stuff
  };
});
```

#### `Plugin.on`

Register handlers for events of other plugins.

```js
on('otherPlugin', {
  eventName(pluginContext, arg1, arg2) {
    // React to event from other plugin
  },
});
```

#### `Plugin.register`

Register the plugin in the global store.

### `PluginContext`

The plugin context API allows you to interact with private plugin data (config, state) as well as other plugins (emit events, call methods). All plugin handlers receive the plugin context as the first argument.

#### `PluginContext.getConfig`

Read own (private) plugin config.

```js
pluginContext.getConfig();
```

#### `PluginContext.getState`

Read own (private) plugin state.

```js
pluginContext.getState();
```

#### `PluginContext.setState`

Change own (private) plugin state.

```js
pluginContext.setState({ enabled: true });

// Or using a state updater callback
pluginContext.setState(prevState => ({
  ...prevState,
  enabled: !prevState.enabled,
}));
```

#### `PluginContext.getMethodsOf`

Get public methods of other plugins.

```js
const otherPlugin = pluginContext.getMethodsOf('otherPlugin');
otherPlugin.doSomething('withThis');

// It's also possible for plugin methods to return something
const value = otherPlugin.getSomething();
```

#### `PluginContext.emit`

Emit event to listeners registered by other plugins via `Plugin.on`.

```js
pluginContext.emit('magicEvent', 'arg1', 'arg2');
```

### Slots

Slots and plugs are reminiscent of the _chicken or egg_ conundrum. In this case, however, the slot definitely came first. Without a root slot nothing gets rendered in the Cosmos UI.

Each plugin can define new slots by rendering `Slot` and `ArraySlot` components.

#### `<Slot>`

Render a slot that accepts a React component plug.

| Prop        | Description                            |
| ----------- | -------------------------------------- |
| `name`      | Unique slot name.                      |
| `children`  | Optional `children` passed to plugs.   |
| `slotProps` | Optional plain object passed to plugs. |

```jsx
<Slot name="coolSlot" />
```

Slots can pass `children` to plugs, as well as data through the `slotProps` prop:

```jsx
<Slot name="coolSlot" slotProps={{ cool: true, level: 100 }}>
  <p>This is cool.</p>
</Slot>
```

#### `<ArraySlot>`

Render a slot that accepts a list of React component plugs.

| Prop        | Description                                          |
| ----------- | ---------------------------------------------------- |
| `name`      | Unique slot name.                                    |
| `slotProps` | Optional plain object passed to plugs.               |
| `plugOrder` | Optional list of plug names to enforce a sort order. |

```jsx
<ArraySlot name="coolSlot" />
```

The plug order can be enforced using the `plugOrder` prop:

```jsx
<ArraySlot name="coolSlot" plugOrder={['plug1', 'plug2', 'plug3']} />
```

## Built-in plugins

The Cosmos UI is built entirely using this plugin API. It literally starts like this:

```jsx
const root = createRoot(container);
root.render(<Slot name="root" />);
```

You can browse the complete list of built-in UI plugins at [packages/react-cosmos-ui/src/plugins](../../packages/react-cosmos-ui/src/plugins).

Here's a few examples of existing slots:

| Type        | Slot name         | Description                  | Plug examples                                                   |
| ----------- | ----------------- | ---------------------------- | --------------------------------------------------------------- |
| `ArraySlot` | `rendererAction`  | Renderer-related buttons.    | Edit fixture source. Go full screen. Toggle responsive preview. |
| `ArraySlot` | `navRow`          | Left-hand nav panel widgets. | Fixture search. Fixture bookmarks. Fixture tree view.           |
| `Array`     | `rendererPreview` | Fixture preview placeholder. | Iframe renderer for web, status message for React Native.       |

## TypeScript

Like everything else in Cosmos, the UI plugin system is built with TypeScript. All plugin APIs are type-safe and use generics where needed.

The plugin system is built around something called a "spec". The spec is a static interface that allows plugins to interact with each other safely without having to be part of the same codebase.

If you browse the [built-in plugins](../../packages/react-cosmos-ui/src/plugins) you'll find a `spec.ts` file inside each plugin. This is an example:

```ts
export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: PlaygroundParams;
  };
  methods: {
    getSelectedFixtureId(): null | FixtureId;
    selectFixture(fixtureId: FixtureId): void;
    unselectFixture(): void;
  };
  events: {
    fixtureSelect(fixtureId: FixtureId): void;
    fixtureReselect(fixtureId: FixtureId): void;
    fixtureUnselect(): void;
  };
};
```

## Publishing

When building your UI plugin make sure it doesn't bundle `react` or `react-plugin` inside it. The Cosmos UI plugin system only works when plugins tap into the global React and ReactPlugin instances. The easiest way achive this is by using Webpack [`externals`](https://webpack.js.org/configuration/externals/):

```js
externals: {
  'react': 'React',
  'react-dom': 'ReactDom',
  'react-plugin': 'ReactPlugin'
}
```

See the Boolean input plugin [webpack config](https://github.com/react-cosmos/react-cosmos/blob/9b65416a2e8abd5ba3c960adf52ffad83de977fa/packages/react-cosmos-plugin-boolean-input/webpack.config.js) for a complete example.

> For a Vite equivalent for Webpack `externals` see [vite-plugin-externals](https://github.com/crcong/vite-plugin-externals).
>
> In the future we might use [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) to remove the need for a bundler to author UI plugins. ESM support is tracked [here](../dev/esm.md).

## What will _you_ create?

All this might seem intimidating but I encourage you to try it out. Create a blank Cosmos plugin and start hacking. Add something you find useful. **Make Cosmos your own.**

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
