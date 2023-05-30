# Server plugins

This is a guide for creating Cosmos server plugins.

## Boilerplate

```js
export default {
  name: 'my-plugin',

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

### `config`

| Argument       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `cosmosConfig` | The user's [Cosmos config](../usage/configuration.md). |
| `command`      | `"dev"` or `"export"`.                                 |
| `platform`     | `"web"` or `"platform"`.                               |

### `devServer`

| Argument       | Description                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------- |
| `cosmosConfig` | The user's [Cosmos config](../usage/configuration.md).                                        |
| `platform`     | `web` or `platform`.                                                                          |
| `httpServer`   | The [http.Server](https://nodejs.org/api/http.html#class-httpserver) instance used by Cosmos. |
| `expressApp`   | The [Express App](https://expressjs.com/en/4x/api.html#app) instance used by Cosmos.          |
| `sendMessage`  | Send a message to the Cosmos UI.                                                              |

### `export`

| Argument       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `cosmosConfig` | The user's [Cosmos config](../usage/configuration.md). |

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
