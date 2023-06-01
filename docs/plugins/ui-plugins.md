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

Slots and plugs make up for the render composition but there more to UI plugins. To function as standalone UI abstractions that can interact in meaningful ways, UI plugins can also have individual configuration, private states, public methods and event handlers.

These are the arguments supported when creating a plugin:

| Arguments | Description                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | UI plugin identifier.                                                                                                              |
| `config`  | Optional plain object config. Passed via Cosmos config under `ui.plugins.{name}` and read privately via `PluginContext.getConfig`. |
| `state`   | Optional plain object state. Accessed privately via `PluginContext.getState` and `PluginContext.setState` .                        |
| `methods` | Optional methods called by other plugins via `PluginContext.getMethodsOf`.                                                         |
| `events`  | Optional events triggered via `PluginContext.emit` and listened to by other plugins via `Plugin.on` handlers.                      |

Once created, a plugin inherits an API that allow it to access its own data and interact with other plugins. These are the available methods:

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

WIP.

| Property       | Description |
| -------------- | ----------- |
| `pluginName`   |             |
| `getMethodsOf` |             |
| `getConfig`    |             |
| `getState`     |             |
| `setState`     |             |
| `emit`         |             |

### `<Slot>`

```jsx
<Slot name="magicSlot" />
```

## Built-in plugins

WIP:

- Reiterate that all Cosmos UI is made from plugins.
- Link to list of built-in UI plugins.
  - Mention TS specs.
- Table with list of popular slots, their descriptions and examples.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
