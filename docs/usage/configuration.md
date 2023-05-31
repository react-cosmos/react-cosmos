# Configuration

## CLI

- The `cosmos` command starts the dev server.
- The `cosmos-native` command starts the dev server for a React Native project.
- The `cosmos-export` command generates a static export.

Some things can be customized using CLI arguments:

| Argument           | Description                                                                                                                                                                                               | Default                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--config`         | Custom config path.                                                                                                                                                                                       | `cosmos.config.json` in the root directory, which is the current working directory or the `--root-dir` value when passed. |
| `--root-dir`       | The root directory that all others paths in this config are relative to. Usually the root of your repo.                                                                                                   | The parent directory of the Cosmos config or the current working directory when you don't use a Cosmos config.            |
| `--lazy`           | Dynamically import fixture and decorator modules as they are loaded. When false all fixture and decorator modules are imported statically and bundled together.                                           | `false`                                                                                                                   |
| `--expose-imports` | Expose user imports and config required for the Cosmos renderer. Used with React Native and in custom integrations. When a path is specified it requires a file extension (eg. `"src/cosmos.imports.ts"`) | `cosmos.imports.ts` or `cosmos.imports.js` in React Native projects, otherwise `false`.                                   |
| `--port`           | Cosmos server port.                                                                                                                                                                                       | `5000`                                                                                                                    |

There rest of the things are customized using the large number of options in the Cosmos config.

## `cosmos.config.json`

The Cosmos config is a **JSON** file, so it can only contain serializable values. This design decision is meant to discourage complex configuration, make it easy to embed config options into the Cosmos UI, and enable visual config editing.

### Config schema

**The best way to learn about the available options in the Cosmos config is to use [config.schema.json](../../packages/react-cosmos/config.schema.json).**

The schema is human readable, but you can also enhance your config with autocomplete in code editors like VS Code.

```jsonc
{
  "$schema": "http://json.schemastore.org/cosmos-config"
  // your options...
}
```

And if you use VS Code you can map the Cosmos config schema globally by [extending your user settings](https://code.visualstudio.com/docs/languages/json#_mapping-in-the-user-settings).

```json
"json.schemas": [
  {
    "fileMatch": ["cosmos.config.json"],
    "url": "http://json.schemastore.org/cosmos-config"
  }
]
```

Alternatively, you can reference the local Cosmos config schema in your workspace configuration.

```json
"json.schemas": [
  {
    "fileMatch": ["cosmos.config.json"],
    "url": "./node_modules/react-cosmos/config.schema.json"
  }
]
```

### Custom viewports

`responsivePreview` is a plugin included by default and you can customize it through the Cosmos config:

```json
{
  "ui": {
    "responsivePreview": {
      "devices": [
        { "label": "iPhone SE", "width": 375, "height": 667 },
        { "label": "iPad mini", "width": 744, "height": 1133 },
        { "label": "1080p", "width": 1920, "height": 1080 }
      ]
    }
  }
}
```

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
