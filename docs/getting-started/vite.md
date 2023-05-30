# Vite

This is a guide for setting up React Cosmos in a Vite project.

## Getting started

Install the required packages:

```bash
npm i -D react-cosmos@next react-cosmos-plugin-vite@next
```

Create `cosmos.config.json` and enable the Vite plugin:

```json
{
  "plugins": ["react-cosmos-plugin-vite"]
}
```

Add `cosmos` and `cosmos-export` scripts to package.json:

```json
"scripts": {
  "cosmos": "cosmos",
  "cosmos-export": "cosmos-export",
}
```

Create a basic fixture at `src/Hello.fixture.jsx`:

```jsx
export default <h1>Hello World!</h1>;
```

Start React Cosmos:

```bash
npm run cosmos
```

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

The `Hello` fixture will show up in your Cosmos UI and will render when you select it.

**Congratulations 😎**

You've taken the first step towards designing reusable components. You're ready to prototype, test and interate on components in isolation.

## Vite config

Cosmos generates a default Vite config if a custom one isn't provided.

### Custom config

Cosmos picks up `vite.config.js` from the project root automatically. Use the `vite.configPath` setting to provide an existing Vite config at a different path:

```json
{
  "vite": {
    "configPath": "./tools/vite.config.js"
  }
}
```

## Configuration

Vite-related settings you can optionally customize in your Cosmos config:

| Option            | Description                                                                    | Default                                  |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| `vite.configPath` | Path to Vite config. Set to false to disable reading it from the default path. | `"vite.config.js"` or `"vite.config.ts"` |
| `vite.indexPath`  | Path to index module (eg. `"src/my-index.tsx"`).                               | _detects common index/main module paths_ |
| `vite.port`       | Vite renderer port.                                                            | `5050`                                   |

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
