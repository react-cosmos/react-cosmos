# Cosmos Plugins

A Cosmos plugin is a wrapper for two plugin types: **server plugins** and **UI plugins**. Each plugin type has a distinct API and runs in a different environment. Combining both into a single Cosmos plugin adds full-stack capabilities to React Cosmos with a single package.

## Creating a Plugin

Create a `cosmos.plugin.json` file:

```json
{
  "name": "Magic plugin",
  "server": "serverPlugin.js",
  "ui": "uiPlugin.js"
}
```

This JSON config is the plugin's entry point. A plugin name and at least one plugin type is required.

> The `server` and `ui` paths are resolved relative to the config's parent directory.

See the individual guides for each plugin type:

- [Server Plugins](server-plugins.md)
- [UI Plugins](ui-plugins.md)

## Enabling a Plugin

Add it to the `plugins` option in the `cosmos.config.json` of the host project:

```json
{
  "plugins": ["../packages/magic-plugin/cosmos.plugin.json"]
}
```

If the Cosmos plugin is an NPM package, add the name of the package to `plugins` instead:

```json
{
  "plugins": ["react-cosmos-plugin-magic"]
}
```

## Publishing a Plugin

To publish a Cosmos plugin as an NPM package, set the `main` field in its `package.json` to `"cosmos.plugin.json"` (or a different path where the Cosmos plugin config is located):

```json
{
  "name": "react-cosmos-plugin-magic",
  "version": "1.0.0",
  "main": "cosmos.plugin.json"
}
```

## Existing Plugins

### Open Fixture Plugin

This combines a [server plugin](server-plugins.md) with a [UI plugin](ui-plugins.md). It adds a renderer action that opens the selected fixture file in your default editor.

```bash
npm i -D react-cosmos-plugin-open-fixture
```

```json
{
  "plugins": ["react-cosmos-plugin-open-fixture"]
}
```

### Boolean Input Plugin

This is a [UI plugin](ui-plugins.md) that turns boolean inputs in the [Control Panel](/docs/usage/user-interface.md#control-panel) from a true/false button to a checkbox input.

```bash
npm i -D react-cosmos-plugin-boolean-input
```

```json
{
  "plugins": ["react-cosmos-plugin-boolean-input"]
}
```

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
