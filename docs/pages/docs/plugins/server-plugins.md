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

For example in the Webpack plugin the Webpack compiler is attached to Cosmos' internal Express app, having the renderer run on the same port as the Cosmos server. In contract, the Vite plugin starts the Vite dev server independently and in this case you end up using two ports—one for the Cosmos server and one for the Vite renderer.

### `export`

| Argument | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `config` | The user's [Cosmos config](/docs/configuration/cosmos-config.md). |

A hook for exporting the user's fixtures and decorators into a static Cosmos renderer that the static Cosmos UI connects to.
