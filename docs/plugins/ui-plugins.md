# UI plugins

The Cosmos UI plugin system consists of an intricate web of "slots" and "plugs" that weave together with minimal knowledge of each other.

> The underlying `react-plugin` library isn't published yet due to time constraints but will be open sourced as a separate project in the future.

Though it will take some time to get familiar with the subtleties of the Cosmos UI plugin architecture, its core principles are simple and so is creating your first “Hello World”.

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

### `createPlugin`

Slots and plugs make up for the render composition but there's more to UI plugins. To function as standalone UI abstractions that can interact in meaningful ways, UI plugins can also have individual configuration, private states, public methods and event handlers.

These are the arguments supported when creating a plugin:

| Argument        | Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | UI plugin identifier.                                                                                                           |
| `defaultConfig` | Optional plain object config. Set via Cosmos config under `ui.plugins.{name}` and read privately via `PluginContext.getConfig`. |
| `initialState`  | Optional plain object state. Accessed privately via `PluginContext.getState` and `PluginContext.setState`.                      |
| `methods`       | Optional method handlers called by other plugins via `PluginContext.getMethodsOf`.                                              |

Once created, the plugin API allows registering UI plugs, as well as `onLoad` and event handlers.

#### `Plugin.plug`

WIP.

#### `Plugin.namedPlug`

WIP.

#### `Plugin.onLoad`

WIP.

#### `Plugin.on`

WIP.

#### `Plugin.register`

WIP.

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

```jsx
<Slot name="magicSlot" />
```

- name: string;
- children?: ReactNode;
- slotProps?: object;

#### `<ArraySlot>`

```jsx
<ArraySlot name="magicSlot" />
```

- name: string;
- slotProps?: object;
- plugOrder?: string[];

## Built-in plugins

WIP:

- Reiterate that all Cosmos UI is made from plugins.
- Link to list of built-in UI plugins.
  - Mention TS specs.
- Table with list of popular slots, their descriptions and examples.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
