# Server Plugins

This is a guide for creating Cosmos server plugins, which enable integrating with bundlers like Vite or Webpack, as well as adding functionality to the Cosmos server.

You can browse a list of built-in server plugins [here](packages/react-cosmos/src/corePlugins/).

## Boilerplate

The `server` field in [`cosmos.plugin.json`](./plugin-config.md) points to a module like this:

```js
export default {
  name: 'magic-plugin',

  async config({ cosmosConfig }) {
    // An opportunity to alter the user's Cosmos config
    return cosmosConfig;
  },

  async devServer({ cosmosConfig, platform, httpServer, expressApp }) {
    // Dev server plugin
  },

  async export({ cosmosConfig }) {
    // Static export plugin
  },
};
```

## Plugin API

### `config`

| Argument       | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `cosmosConfig` | The user's [Cosmos config](../usage/configuration.md#cosmosconfigjson). |
| `command`      | `"dev"` or `"export"`.                                                  |
| `platform`     | `"web"` or `"native"`.                                                  |

The `config` hook is called before both `devServer` and `export` hooks. It allows overriding the user's Cosmos config. Setting the `rendererUrl` config option is a common use case.

### `devServer`

| Argument       | Description                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------- |
| `cosmosConfig` | The user's [Cosmos config](../usage/configuration.md#cosmosconfigjson).                       |
| `platform`     | `"web"` or `"native"`.                                                                        |
| `httpServer`   | The [http.Server](https://nodejs.org/api/http.html#class-httpserver) instance used by Cosmos. |
| `expressApp`   | The [Express App](https://expressjs.com/en/4x/api.html#app) instance used by Cosmos.          |
| `sendMessage`  | Send a message to the Cosmos UI.                                                              |

A hook for starting the renderer dev server alongside the Cosmos server.

For example in the Webpack plugin the Webpack compiler is attached to Cosmos' internal Express app, having the renderer run on the same port as the Cosmos server. In contract, the Vite plugin starts the Vite dev server independently and in this case you end up using two ports—one for the Cosmos server and one for the Vite renderer.

### `export`

| Argument       | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `cosmosConfig` | The user's [Cosmos config](../usage/configuration.md#cosmosconfigjson). |

A hook for exporting the user's fixtures and decorators into a static Cosmos renderer that the static Cosmos UI connects to.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
