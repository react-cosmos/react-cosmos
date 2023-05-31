# Plugin config

This is a guide for creating Cosmos plugins.

Create a `cosmos.plugin.json` file:

```json
{
  "name": "Magic plugin",
  "server": "serverPlugin.js",
  "ui": "uiPlugin.js"
}
```

This JSON config is the plugin's entry point.

A Cosmos plugin can contain a **server plugin** and a **UI plugin**. At least one is required, along with a plugin name. The `server` and `ui` paths are resolved relative to the config's parent directory.

To enable a Cosmos plugin add it to the `plugins` option in the `cosmos.config.json` of the host project:

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

To publish a Cosmos plugin as an NPM package, set the `main` field in its `package.json` to `"cosmos.plugin.json"` (or a different path where the Cosmos plugin config is located):

```json
{
  "name": "react-cosmos-plugin-magic",
  "version": "1.0.0",
  "main": "cosmos.plugin.json"
}
```

See the individual guides for each plugin type:

- [Server plugins](server-plugins.md)
- [UI plugins](ui-plugins.md)

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
