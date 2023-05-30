# Plugin config

This is a guide for creating a Cosmos plugin.

Create a `cosmos.plugin.json` file:

```json
{
  "name": "Magic plugin",
  "server": "serverPlugin.js",
  "ui": "uiPlugin.js"
}
```

This JSON config is the plugin's entry point.

Aside from the name, a Cosmos plugin can have a server component and a UI component. At least one is required. The `server` and `ui` paths are resolved relative to the config's parent directory.

To enable a Cosmos plugin, add the parent directory of the plugin config to the `plugins` option in the `cosmos.config.json` of the host project:

```json
{
  "plugins": ["../packages/magic-plugin"]
}
```

If the Cosmos plugin is published as an NPM package, set the `main` field in `package.json` to `"cosmos.plugin.json"` (or a different path where the Cosmos plugin config is located) and the name of the package in the `cosmos.config.json` plugins list:

```json
{
  "name": "react-cosmos-plugin-magic",
  "version": "1.0.0",
  "main": "cosmos.plugin.json"
}
```

```json
{
  "plugins": ["react-cosmos-plugin-magic"]
}
```

See the individual guides for each plugin type:

- [Server plugins](plugins/server-plugins.md)
- [UI plugins](plugins/ui-plugins.md)

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
