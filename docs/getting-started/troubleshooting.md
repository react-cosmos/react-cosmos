# Troubleshooting

### "Failed to execute postMessage..."?

- [You may have a URL instance in your state](https://github.com/react-cosmos/react-cosmos/issues/1002).

### Fixtures not detected?

- Run `cosmos` with the `--expose-imports` flag. This should generate `cosmos.imports.js`. Check that file to see if your fixtures are being picked up by Cosmos.
- Check your directory structure. If you are using a Cosmos config file, Cosmos will use the directory of the config file as the root of your project. If your Cosmos config file is nested in a directory that isn't an ancestor of your fixture files Cosmos won't find your fixtures. To solve this add a `rootDir` entry to your Cosmos config pointing to your root directory.

## Webpack-related

> **Warning** Most React Cosmos Webpack issues are related to missing build dependencies. Please see [Webpack config](webpack.md#webpack-config).

### _localhost:5000/renderer.html_ 404s?

- Check for build errors in your terminal.
- Make sure you have `html-webpack-plugin` installed, as well as [any other build dependency](webpack.md#webpack-config).

### Renderer not responding?

- Try renaming `filename` in HtmlWebpackPlugin options to `index.html`, or alternatively remove the HtmlWebpackPlugin plugin from your Webpack config and Cosmos will automatically it with the proper options. For more details see [this issue](https://github.com/react-cosmos/react-cosmos/issues/1220).

### _localhost:3001/\_\_get-internal-source..._ 404s?

- [Try changing your Webpack `devtool` to something like `cheap-module-source-map`](https://github.com/react-cosmos/react-cosmos/issues/1045#issuecomment-535150617).

### main.js file is cached in static exports?

- [Set `includeHashInOutputFilename` to `true`](webpack.md#output-filename).

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
