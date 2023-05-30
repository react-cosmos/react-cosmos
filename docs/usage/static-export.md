# Static export

Get a nice component library that you can deploy to any static hosting service.

> **Note** The exported Cosmos UI won't have all the features available in development (like opening the selected fixture in your code editor), but allows anybody with access to the static export URL to browse fixtures and play with component inputs.

Add `cosmos-export` script to package.json:

```diff
"scripts": {
  "cosmos": "cosmos",
+ "cosmos-export": "cosmos-export"
}
```

Build React Cosmos export:

```bash
npm run cosmos-export
```

Serve the static export:

```bash
npx http-server ./cosmos-export
```

## Configuration

| Option       | Description                          | Default           |
| ------------ | ------------------------------------ | ----------------- |
| `exportPath` | Output directory for static exports. | `"cosmos-export"` |

## Bundler integration

The `cosmos-export` command creates a static export of the Cosmos UI shell, which expects a corresponding static Renderer to connect with. Without a Cosmos bundler plugin, the latter will be missing.

The Vite or Webpack plugins take care of exporting automatically. Creating a static export in a [custom bundler setup](../getting-started/custom-bundler.md) will require additional steps. See the [Next.js guide](../getting-started/next.md#static-export) for such an example.
