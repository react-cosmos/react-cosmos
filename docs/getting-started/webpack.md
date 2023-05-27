# Webpack

```bash
npm i -D react-cosmos@next react-cosmos-plugin-webpack@next
```

Create `cosmos.config.json` and enable the Webpack plugin:

```json
{
  "plugins": ["react-cosmos-plugin-webpack"]
}
```

Add `cosmos` script to package.json:

```json
"scripts": {
  "cosmos": "cosmos"
}
```

Start React Cosmos:

```bash
npm run cosmos
```

## Webpack config

Cosmos generates a default Webpack config if a custom one isn't provided.

> **Warning** Cosmos compiles your code using dependencies you already installed in your project. Cosmos will auto include common loaders like `babal-loader`, `ts-loader`, `css-loader`, etc. in the default Webpack config. Use a [custom Webpack config](#custom-webpack-config) for more advanced use cases.

> **Warning** Make sure `html-webpack-plugin` is installed in your project.

> **Warning** You may also need to create a `.babelrc` in your project root.

### Custom config

Probably the most common scenario. Most of us end up with a hairy Webpack config sooner or later.

Cosmos picks up `webpack.config.js` from the project root automatically. Use the `webpack.configPath` setting to provide an existing Webpack config at a different path:

```json
{
  "webpack": {
    "configPath": "./tools/webpack.config.js"
  }
}
```

> You can also point to a module inside a dependency, like in the [Create React App](create-react-app.md) example.

### Config override

Overriding the Webpack config gives you complete control. Use the `webpack.overridePath` setting to point to a module that customizes the Webpack config used by Cosmos.

```json
{
  "webpack": {
    "overridePath": "./webpack.override.js"
  }
}
```

The override function receives a base Webpack config — the default one generated by Cosmos or a custom one loaded from `webpack.configPath`. Extend the input config and return the result.

```js
// webpack.override.js
module.exports = (webpackConfig, env) => {
  return { ...webpackConfig /* do your thing */ };
};
```

### Output filename

Cosmos overwrites `output.filename` in the Webpack config to `[name].js` by default. Due to caching, this isn't ideal when generating static exports via `cosmos-export` command. Use the `webpack.includeHashInOutputFilename` setting to change the filename template to `[name].[contenthash].js`.

```json
{
  "webpack": {
    "includeHashInOutputFilename": true
  }
}
```

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.