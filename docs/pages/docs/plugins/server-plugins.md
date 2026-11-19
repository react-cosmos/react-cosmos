# Server Plugins

This is a guide for creating Cosmos server plugins, which enable integrating with bundlers like Vite or Webpack, as well as adding functionality to the Cosmos server.

You can browse a list of built-in server plugins [here](https://github.com/react-cosmos/react-cosmos/tree/main/packages/react-cosmos/src/corePlugins).

## Boilerplate

The `server` field in [`cosmos.plugin.json`](/docs/plugins.md) points to a module like this:

```js
export default {
  name: 'magic-plugin',

  async config({ config }) {
    // An opportunity to alter the user's Cosmos config
    return config;
  },

  async devServer({ config, platform, httpServer, app }) {
    // Dev server plugin
  },

  async export({ config }) {
    // Static export plugin
  },
};
```

## Plugin API

### `config`

| Argument   | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `config`   | The user's [Cosmos config](/docs/configuration/cosmos-config.md). |
| `mode`     | `"dev"` or `"export"`.                                            |
| `platform` | `"web"` or `"native"`.                                            |

The `config` hook is called before both `devServer` and `export` hooks. It allows overriding the user's Cosmos config. Setting the `rendererUrl` config option is a common use case.

### `devServer`

| Argument      | Description                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------- |
| `config`      | The user's [Cosmos config](/docs/configuration/cosmos-config.md).                             |
| `platform`    | `"web"` or `"native"`.                                                                        |
| `httpServer`  | The [http.Server](https://nodejs.org/api/http.html#class-httpserver) instance used by Cosmos. |
| `app`         | The [Express App](https://expressjs.com/en/4x/api.html#app) instance used by Cosmos.          |
| `sendMessage` | Send a message to the Cosmos UI.                                                              |

A hook for starting the renderer dev server alongside the Cosmos server.

For example the Webpack and Vite plugins attach their bundler to Cosmos' internal Express app, having the renderer run on the same port as the Cosmos server. This is the recommended approach, because the renderer URL is a path on the Cosmos server that's known from the start. A plugin can also start a renderer server of its own, but then it has to set a `rendererUrl` in the `config` hook that it's certain to end up serving.

The Cosmos server is already listening when this hook is called, and `config.port` is the port it's listening on. This can differ from the `port` received by the `config` hook, because Cosmos moves to the next available port when the configured one is taken.

Plugins can run their own WebSockets on the Cosmos server by listening to the `upgrade` event of `httpServer`. Cosmos only handles the connections of the Cosmos UI and the renderers, which target the server root without a subprotocol, and leaves all other upgrade requests to plugins.

### `export`

| Argument | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `config` | The user's [Cosmos config](/docs/configuration/cosmos-config.md). |

A hook for exporting the user's fixtures and decorators into a static Cosmos renderer that the static Cosmos UI connects to.
