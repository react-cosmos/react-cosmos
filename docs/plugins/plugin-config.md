# Plugin config

This is a guide for creating a new Cosmos plugin.

Create a `cosmos.plugin.json` file:

```json
{
  "name": "My Plugin",
  "server": "serverPlugin.js",
  "ui": "uiPlugin.js"
}
```

Theis JSON config is the plugin's entry point.

Aside from the name, a Cosmos plugin can have a server component and a UI component. At least one is required. The `server` and `ui` paths are resolved relative to the config's parent directory.

To enable a Cosmos plugin, the parent directory of the plugin config has to be added to the `plugins` option in the `cosmos.config.json` of the host project.

If the Cosmos plugin is published as a NPM package, set the `main` field in `package.json` to `"cosmos.plugin.json"` (or a different path where the Cosmos plugin config is).

See the individual guides for each plugin type:

- [Server plugins](plugins/server-plugins.md)
- [UI plugins](plugins/ui-plugins.md)

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
