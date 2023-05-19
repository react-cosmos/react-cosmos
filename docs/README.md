## Table of contents

> The current docs are for React Cosmos 6. Check out the [migration guide](MIGRATION_V6.md) to upgrade from v5.

- Setup: [Getting started](#getting-started) · [Config](#config) · [Compilation](#compilation) · [Webpack](#webpack)
- Usage: [Fixtures](#fixtures) · [Decorators](#decorators) · [Mocks](#declarative-mocks) · [Control panel](#control-panel) · [UI plugins](#ui-plugins) · [Static export](#static-export) · [React Native](reactNative.md) · [Server-side APIs](#server-side-apis)
- FAQ: [Create React App](#create-react-app) · [Next.js](next.md) · [Troubleshooting](#troubleshooting) · [Roadmap](../roadmap)

## Getting started

> This is a web guide. See [this guide](reactNative.md) for React Native.

1\. **Install React Cosmos**

```bash
npm i -D react-cosmos@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos@next
```

2\. **Set up bundler**

<details>
  <summary>Vite plugin</summary>

```bash
npm i -D react-cosmos-plugin-vite@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos-plugin-vite@next
```

Create `cosmos.config.json` and enable Vite plugin.

```json
{
  "plugins": ["react-cosmos-plugin-vite"]
}
```

</details>

<details>
  <summary>Webpack plugin</summary>

```bash
npm i -D react-cosmos-plugin-webpack@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos-plugin-webpack@next
```

Create `cosmos.config.json` and enable Webpack plugin.

```json
{
  "plugins": ["react-cosmos-plugin-webpack"]
}
```

</details>

<details>
  <summary>Next.js</summary>

[Check out this guide](next.md).

</details>

<details>
  <summary>Custom bundler setup</summary>

[Check out this guide](customBundlerSetup.md).

</details>

3\. **Add package.json scripts**

```diff
"scripts": {
+  "cosmos": "cosmos",
+  "cosmos:export": "cosmos-export"
}
```

4\. **Start React Cosmos**

```bash
npm run cosmos
```

Or if you’re using Yarn:

```bash
yarn cosmos
```

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

5\. **Create your first fixture**

Choose a simple component to get started.

<!-- prettier-ignore -->
```jsx
// Hello.jsx
import React from 'react';

export function Hello({ greeting, name }) {
  return <h1>{greeting}, {name}!</h1>;
}
```

Create a `.fixture` file.

> Fixture files contain a default export, which can be a React Component or any React Node.

```jsx
// Hello.fixture.jsx
import React from 'react';
import { Hello } from './Hello';

export default <Hello greeting="Aloha" name="Alexa" />;
```

The `Hello` fixture will show up in your React Cosmos UI and will render when you select it.

**Congratulations 😎**

You've taken the first step towards designing reusable components. You're ready to prototype, test and interate on components in isolation.

### Next steps...

- [Configure Webpack config](#webpack).
- [Create a decorator](#decorators).
- [Check out Vite and Webpack examples](../examples).

> Something wrong? Don't hesitate to [create a GitHub issue](https://github.com/react-cosmos/react-cosmos/issues/new/choose) (make sure to include details) and to [join us on Discord](https://discord.gg/3X95VgfnW5).

## Config

The React Cosmos config is a **JSON** file, so it can only contain serializable values. This design decision is meant to discourage complex configuration, make it easy to embed config options into the React Cosmos UI, and enable visual config editing in the future.

By default, Cosmos reads `cosmos.config.json` from your root directory. You can pass a `--config` CLI arg for a custom config path.

### Available options

The best way to learn about the available options in the Cosmos config is to use [config.schema.json](../packages/react-cosmos/config.schema.json).

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

## Compilation

How you compile your code is 100% your business. React Cosmos jumps through hoops to compile your code using your existing build pipeline, but it doesn't install any additional dependencies that your setup requires to compile your code.

**React Cosmos compiles your code using the build dependencies already installed in your project.**

Unless you use a framework like Create React App or Next.js, you need to install build dependencies yourself. This includes stuff like Babel, TypeScript, Webpack loaders, html-webpack-plugin, etc.

Here is a common list of packages required to build React with Webpack and Babel:

> @babel/core @babel/preset-env @babel/preset-react babel-loader style-loader css-loader html-webpack-plugin@4

And unless you use a framework that does it under the hood, create a `.babelrc` (or similar) config in your project root.

```
{
  "presets": ["@babel/env", "@babel/react"]
}
```

## Webpack

Configuring Webpack is the least romantic aspect of the Cosmos setup. Luckily, you only do it once. Depending on your setup, one of the following options will work for you.

### Default Webpack config

In many cases Cosmos manages to get Webpack working without human intervention. Try running Cosmos as is first.

### Custom Webpack config

Probably the most common scenario. Most of us end up with a hairy Webpack config sooner or later. Use the `webpack.configPath` setting to point to an existing Webpack config.

```json
{
  "webpack": {
    "configPath": "./webpack.config.js"
  }
}
```

> You can also point to a module inside a dependency, like in the [Create React App](#create-react-app) example.

### Webpack config override

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

## Fixtures

Fixture files contain a default export, which can be a React Component or any React Node.

> `React` must be imported in every fixture file.

The file paths of your fixture files (relative to your project root) are used to create a tree view explorer in the React Cosmos UI.

### Node fixtures

> Think of Node fixtures as the return value of a function component, or the first argument to `React.render`.

```jsx
// Button.fixture.jsx
export default <Button disabled>Click me</Button>;
```

### Component fixtures

Component fixtures are just function components with no props. They enable using Hooks inside fixtures, which is powerful for simulating state with stateless components.

```jsx
// CounterButton.fixture.jsx
export default () => {
  const [count, setCount] = React.useState(0);
  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

### Multi fixture files

A fixture file can also export multiple fixtures if the default export is an object.

```jsx
// Button.fixture.jsx
export default {
  primary: <PrimaryButton>Click me</PrimaryButton>,
  primaryDisabled: <PrimaryButton disabled>Click me</PrimaryButton>,
  secondary: <SecondaryButton>Click me</SecondaryButton>,
  secondaryDisabled: <SecondaryButton disabled>Click me</SecondaryButton>,
};
```

The object property names will show up as fixture names in the Cosmos UI.

> [See this comment](https://github.com/react-cosmos/react-cosmos/issues/924#issuecomment-462082405) for the reasoning behind this solution (vs named exports).

### How to create fixture files

Two options:

1. End fixture file names with `.fixture.{js,jsx,ts,tsx}`
2. Put fixture files inside `__fixtures__`

Examples:

1. `blankState.fixture.jsx`
2. `__fixtures__/blankState.jsx`

> File name conventions can be configured using the `fixturesDir` and `fixtureFileSuffix` options.

**IMPORTANT:** Fixture files must be placed in the `src` directory when using Create React App, in order for Cosmos to bundle in the exact same environment as Create React App's.

## Decorators

Wrapping components inside fixtures is easy, but can become repetitive. _Decorators_ can be used to apply one or more component wrappers to a group of fixtures automatically.

A `cosmos.decorator` file looks like this:

```jsx
// cosmos.decorator.js
export default ({ children }) => <Provider store={store}>{children}</Provider>;
```

> A decorator only applies to fixture files contained in the decorator's directory. Decorators can be composed, in the order of their position in the file system hierarchy (from outer to inner).

### Redux state mock

Check out [react-cosmos-redux](https://github.com/skidding/react-cosmos-redux) to see what an advanced React Cosmos decorator looks like.

## Declarative mocks

Coming up with dummy prop values is all that's required to create fixtures for many components. In other cases, however, components have _special needs_.

Some components need to be wrapped in certain _contexts_, like a Router provider. Other components fire `fetch` requests willy-nilly. All these implicit dependencies are component inputs and understanding them goes a long way.

The [react-mock](https://github.com/skidding/react-mock) project provides ways for mocking implicit component dependencies and helps you create fixtures for _stubborn_ components.

## Control panel

The [props panel](https://twitter.com/ReactCosmos/status/1139838627976843264) allows you to manipulate component props visually by default. But you can also get a custom control panel by manually defining the UI controls in your fixtures.

### `useValue`

```jsx
// CounterButton.fixture.jsx
import { useValue } from 'react-cosmos/client';

export default () => {
  const [count, setCount] = useValue('count', { defaultValue: 0 });
  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

### `useSelect`

```jsx
// Button.fixture.jsx
import { useSelect } from 'react-cosmos/client';

export default () => {
  // useSelect also returns a setter as the second value in the return tuple,
  // like the useState hook, in case you want to change the value programatically.
  const [buttonType] = useSelect('buttonType', {
    options: ['primary', 'secondary', 'danger'],
  });
  return <Button type={buttonType}>Press me</Button>;
};
```

> Heads up: `useValue` and `useSelect` (and Cosmos in general) work great with TypeScript.

## UI plugins

The React Cosmos UI is made up 100% from plugins. Documenting the plugin API is in progress. In the meantime you can use and customize built-in plugins.

### Custom [responsive viewports](https://twitter.com/ReactCosmos/status/1158701342208208897)

`responsivePreview` is a plugin included by default, and you can customize it through the Cosmos config.

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

## Static export

Run `cosmos-export` and get a nice component library that you can deploy to any static hosting service. The exported version won't have all the Cosmos features available in development (like opening the selected fixture in your code editor), but allows anybody with access to the static export URL to browse fixtures and play with component inputs.

> Use [http-server](https://github.com/indexzero/http-server) or any static file server to load the export locally.

## Server-side APIs

> Do **NOT** use these APIs in your fixture files, or any of your client code, as they require access to the file system and may bundle unwanted Node code in your client build.

### Config

Fetching a Cosmos config can be done in a number of ways, depending on whether or not you have a config file and, in case you do, if you prefer to specify the path manually or to rely on automatic detection.

#### Detect existing config based on cwd

`detectCosmosConfig` uses the same config detection strategy as the `cosmos` command.

```js
import { detectCosmosConfig } from 'react-cosmos';

const cosmosConfig = await detectCosmosConfig();
```

#### Read existing config at exact path

`getCosmosConfigAtPath` is best when you don't want to care where you run a script from.

```js
import { getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = await getCosmosConfigAtPath(
  require.resolve('./cosmos.config')
);
```

#### Create default config

The minimum requirement to create a config is a root directory.

```js
import { createCosmosConfig } from 'react-cosmos';

const cosmosConfig = createCosmosConfig(__dirname);
```

#### Create custom config

You can also customize your config programatically, without the need for an external config file.

```js
import { createCosmosConfig } from 'react-cosmos';

const cosmosConfig = createCosmosConfig(__dirname, {
  // Options... (TypeScript is your friend)
});
```

### Fixtures

Get all your fixtures programatically. A ton of information is provided for each fixture, enabling you to hack away on top of React Cosmos. To generate visual snapshots from your fixtures, you load `rendererUrl` in a headless browser like [Puppeteer](https://github.com/puppeteer/puppeteer) and take a screenshot on page load. You can compare visual snapshots between deploys to catch sneaky UI regressions.

```js
import { getFixtures } from 'react-cosmos';

const fixtures = getFixtures(cosmosConfig);

console.log(fixtures);
// [
//   {
//     "absoluteFilePath": "/path/to/components/pages/Error/__fixtures__/not-found.js",
//     "fileName": "not-found",
//     "name": null,
//     "parents": ["pages", "Error"]
//     "playgroundUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2Fpages%2FError%2F__fixtures__%2Fnot-found.js%22%2C%22name%22%3Anull%7D",
//     "relativeFilePath": "components/pages/Error/__fixtures__/not-found.js",
//     "rendererUrl": "http://localhost:5000/static/renderer.html?fixtureId=%7B%22path%22%3A%22components%2Fpages%2FError%2F__fixtures__%2Fnot-found.js%22%2C%22name%22%3Anull%7D",
//     "treePath": ["pages", "Error", "not-found"]
//   },
//   ...
```

> See a more complete output example [here](../examples/webpack/tests/fixtures.test.ts).

Aside from the fixture information showcased above, each fixture object returned also contains a `getElement` function property, which takes no arguments. `getElement` allows you to render fixtures in your own time, in environments like jsdom. Just as in the React Cosmos UI, the fixture element will include any decorators you've defined for your fixtures. `getElement` can be used for Jest snapshot testing.

## Create React App

- Add `react-cosmos-plugin-webpack` plugin.
- Set `staticPath` to `public` to load static assets inside React Cosmos.
- Restrict `watchDirs` to `src` to ignore file changes outside the source directory.
- Set `webpack.configPath` to `react-scripts/config/webpack.config`. Unless you use react-app-rewired (see below).
- Make sure to place fixture and decorator files in the `src` directory.

This is a `cosmos.config.json` example for Create React App:

```json
{
  "plugins": ["react-cosmos-plugin-webpack"],
  "staticPath": "public",
  "watchDirs": ["src"],
  "webpack": {
    "configPath": "react-scripts/config/webpack.config"
  }
}
```

Disable Fast Refresh in your `cosmos` commmand.

```diff
"scripts": {
-  "cosmos": "cosmos",
+  "cosmos": "FAST_REFRESH=false cosmos"
}
```

> Your mileage may vary, but using CRA's internal webpack config inside Cosmos has caused React Refresh [issues](https://github.com/react-cosmos/react-cosmos/issues/1272) in the past. You disable it as shown above or you may also _not_ set `webpack.configPath` to `"react-scripts/config/webpack.config"` and have Cosmos run with a more minimalistic alternative to the [CRA webpack config](https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-scripts/config/webpack.config.js).

### Using react-app-rewired

In a standard Create React App setup you config React Cosmos to use CRA's internal Webpack config (see above). With react-app-rewired, however, create the following Webpack config in your project root instead.

```js
// webpack.config.js
const { paths } = require('react-app-rewired');
const overrides = require('react-app-rewired/config-overrides');
const config = require(paths.scriptVersion + '/config/webpack.config.dev');

module.exports = overrides.webpack(config, process.env.NODE_ENV);
```

> React Cosmos picks up `webpack.config.js` automatically. Use `webpack.configPath` if you prefer to customize the Webpack config path.

### Using CRACO with Tailwind CSS

[CRACO](https://github.com/gsoft-inc/craco) is an alternative to react-app-rewired for overriding CRA's internal Webpack config. [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) recommends using CRACO to override CRA's PostCSS settings, which is why this guide targets CRACO and Tailwind CSS together.

- Create `webpack.config.js` in your root folder (if you haven't already) with the following contents:

```js
/* webpack.config.js */
const { createWebpackDevConfig } = require('@craco/craco');
const cracoConfig = require('./craco.config.js');
const webpackConfig = createWebpackDevConfig(cracoConfig);

module.exports = webpackConfig;
```

- If you're using Tailwind CSS or another similar CSS library, add your global CSS to `globalImports` in the Cosmos config. Create `cosmos.config.json` in your root folder (if you haven't already) with the following contents:

```json
{
  "globalImports": ["src/index.css"],
  "staticPath": "public"
}
```

> Cosmos picks up `webpack.config.js` automatically. Since you're relying on the exported wepack config generated by CRACO, don't forgot to remove `"webpack.configPath": "react-scripts/config/webpack.config"` from your `cosmos.config.json` if you previously set it. Use `webpack.configPath` if you prefer to customize the Webpack config path.

> `globalImports` accepts an array of paths and you can add additional global CSS files like this: `"globalImports": ["src/index.css", "src/app.css"]`.

## Troubleshooting

> **Warning**: Most React Cosmos issues are related to missing build dependencies. Please see [Compilation](#compilation).

#### localhost:5000/\renderer.html 404s?

- Check for build errors in your terminal.
- Make sure you have html-webpack-plugin@4 installed, as well as [any other build dependency](#compilation).

#### Renderer not responding?

- Try renaming `filename` in HtmlWebpackPlugin options to `index.html`, or alternatively remove HtmlWebpackPlugin from your Webpack config since Cosmos will create one for you if none is found. For more details see [this issue](https://github.com/react-cosmos/react-cosmos/issues/1220).

#### "Failed to execute postMessage..."?

- [You may have a URL instance in your state](https://github.com/react-cosmos/react-cosmos/issues/1002).

#### "localhost:3001/\_\_get-internal-source..." 404s?

- [Try changing your Webpack `devtool` to something like `cheap-module-source-map`](https://github.com/react-cosmos/react-cosmos/issues/1045#issuecomment-535150617).

#### main.js file is cached?

- [Set `includeHashInOutputFilename` to `true`](https://github.com/react-cosmos/react-cosmos/tree/main/docs#output-filename).

#### Fixtures not detected?

- Run `cosmos` with the `--expose-imports` flag. This should generate `cosmos.imports.js`. Check that file to see if your fixtures are being picked up by Cosmos.
- Check your directory structure. If you are using a Cosmos config file, Cosmos will use the directory of the config file as the root of your project. If your Cosmos config file is nested in a directory that isn't an ancestor of your fixture files, Cosmos will not find your fixtures. To solve this add a [`rootDir`](https://github.com/react-cosmos/react-cosmos/blob/d800a31b39d82c810f37a2ad0d25eed5308b830a/packages/react-cosmos/config.schema.json#L10-L14) entry to your Cosmos config pointing to your root directory.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
