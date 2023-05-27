# Vite

```bash
npm i -D react-cosmos@next react-cosmos-plugin-vite@next
```

Create `cosmos.config.json` and enable the Vite plugin:

```json
{
  "plugins": ["react-cosmos-plugin-vite"]
}
```

Add `cosmos` script to package.json:

```diff
"scripts": {
  "cosmos": "cosmos"
}
```

Start React Cosmos:

```bash
npm run cosmos
```

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

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
