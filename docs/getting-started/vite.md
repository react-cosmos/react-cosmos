# Vite

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

Add `cosmos` script to package.json:

```json
"scripts": {
  "cosmos": "cosmos"
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

## Vite settings

Vite-related settings you can optionally customize in your Cosmos config:

- `vite.indexPath` — Path to the index module that's added as a script in `index.html`. In most cases it's auto detected.
- `vite.port` — Customize Vite renderer port (default is 5050).

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
