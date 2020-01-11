## Table of contents

- Setup: [Getting started](#getting-started) · [Requirements](#requirements) · [Config](#config) · [Compilation](#compilation) · [Webpack](#webpack)
- Usage: [Fixtures](#fixtures) · [Decorators](#decorators) · [Mocks](#declarative-mocks) · [UI controls](#ui-controlled-values) · [UI plugins](#ui-plugins) · [Static export](#static-export) · [React Native](#react-native) · [Server-side APIs](#server-side-apis)
- FAQ: [Troubleshooting](#troubleshooting) · [Where's my old Cosmos?](#wheres-my-old-cosmos) · [Roadmap](../TODO.md)

The [example package](../example) is a useful complement to this guide.

## Getting started

1\. **Install React Cosmos**

```bash
# Using npm
npm i --D react-cosmos
# or Yarn
yarn add --dev react-cosmos
```

> Please see [Compilation](#compilation) to make sure you installed all necessary dependencies.

2\. **Create package.json scripts**

```diff
"scripts": {
+  "cosmos": "cosmos",
+  "cosmos:export": "cosmos-export"
}
```

3\. **Start React Cosmos**

```bash
# Using npm
npm run cosmos
# or Yarn
yarn cosmos
```

🚀 **[localhost:5000](http://localhost:5000)**

> You may also run `npx react-cosmos` in your project without installing any deps.

4\. **Create your first fixture**

Choose a simple component to get started.

<!-- prettier-ignore -->
```jsx
// Hello.jsx
import React from 'react';

export function Hello({ greeting, name }) {
  return <h1>{greeting}, {name}!</h1>;
}
```

Create a fixture file in a `__fixtures__` directory. You can [customize this convention](#how-to-create-fixture-files) later.

> Fixture files contain a default export, which can be a React Component or any React Node.

```jsx
// __fixtures__/hello.jsx
import React from 'react';
import { Hello } from '../Hello';

export default <Hello greeting="Aloha" name="Alexa" />;
```

The `hello` fixture will show up in your React Cosmos UI and will render when you select it.

5\. **Build amazing user interfaces**

You've taken the first step towards designing reusable components. You can now prototype, test and interate on components in isolation. Use this to your advantage!

_Something wrong?_ Don't hesitate to [create a GitHub issue](https://github.com/react-cosmos/react-cosmos/issues/new/choose) (be helpful and include details) and to [join us on Slack](https://join-react-cosmos.now.sh/).

## Requirements

The only hard requirements are React 16.8 and Node 8 (or newer).

React Cosmos works best with webpack 4. It takes extra effort to make it work with other bundlers, but it's not as scary as it might seem. Don’t be afraid to ask for support.

> [Browserify](https://github.com/react-cosmos/react-cosmos-classic/tree/14e1a258f746df401a41ab65429df0d296b910e4/examples/browserify) and [Parcel](https://github.com/react-cosmos/parcel-ts-example) examples are available for Cosmos Classic. Props to whoever adapts them to React Cosmos 5!

## Config

No config is required to start. If you have custom needs or would like to convert a Cosmos Classic config, here's what you need to know.

The React Cosmos config is a **JSON** file, so it can only host serializable values. This design decision is meant to discourage complex configuration, make it easy to embed config options into the UI, and enable visual config management in the future.

By default, Cosmos reads `cosmos.config.json` from your root directory. You can pass a `--config` CLI arg for a custom config path.

> Most Cosmos Classic config options are still supported in the new JSON format. [Let me know](https://join-react-cosmos.now.sh/) if you need old config options that no longer work.

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

## Compilation

How you compile your code is 100% your business. React Cosmos jumps through hoops to compile your code using your existing build pipeline, but it doesn't install any additional dependencies that your setup requires to compile your code.

**React Cosmos compiles your code using the build dependencies already installed in your project.**

Unless you use a framework like Create React App or Next.js, you need to install build dependencies yourself. This include stuff like Babel, TypeScript, webpack loaders, html-webpack-plugin, etc.

Here is a common list of packages required to build React with webpack and Babel:

> @babel/core @babel/preset-env @babel/preset-react babel-loader style-loader css-loader html-webpack-plugin

And unless you use a framework that does it under the hood, create a `.babelrc` (or similar) config in your project root.

```
{
  "presets": ["@babel/env", "@babel/react"]
}
```

## Webpack

Configuring webpack is the least romantic aspect of the Cosmos setup. Luckily, you only do it once. Depending on your setup, one of the following options will work for you.

### Default webpack config

In many cases Cosmos manages to get webpack working without human intervention. Try running Cosmos as is first.

### Custom webpack config

Probably the most common scenario. Most of us end up with a hairy webpack config sooner or later. Use the `webpack.configPath` setting to point to an existing webpack config.

You can also point to a module inside a dependency, like in the following Create React App example.

```json
{
  "watchDirs": ["src"],
  "webpack": {
    "configPath": "react-scripts/config/webpack.config"
  }
}
```

> Both `watchDirs` and `webpack.configPath` options are recommended for a seamless integration with Create React App.

### Webpack config override

Overriding the webpack config gives you complete control. Use the `webpack.overridePath` setting to point to a module that customizes the webpack config used by Cosmos.

```json
{
  "webpack": {
    "overridePath": "./webpack.override.js"
  }
}
```

The override function receives a base webpack config — the default one generated by Cosmos or a custom one loaded from `webpack.configPath`. Extend the input config and return the result.

```js
// webpack.override.js
module.exports = (webpackConfig, env) => {
  return { ...webpackConfig /* do your thing */ };
};
```

## Fixtures

Fixture files contain a default export, which can be a React Component or any React Node.

> `React` must be imported in every fixture file.

The file paths of your fixture files (relative to your project root) are used to create a tree view explorer in the React Cosmos UI.

### Node fixtures

> Think of Node fixtures as the return value of a function component, or the first argument to `React.render`.

```jsx
// __fixtures__/disabled.js
export default <Button disabled>Click me</Button>;
```

### Component fixtures

Component fixtures are just function components with no props. They enable using Hooks inside fixtures, which is powerful for simulating state with stateless components.

```jsx
// CounterButton.fixture.js
export default () => {
  const [count, setCount] = React.useState(0);
  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

### Multi fixture files

A fixture file can also export multiple fixtures if the default export is an object.

```jsx
// buttons.fixture.js
export default {
  primary: <PrimaryButton>Click me</PrimaryButton>,
  primaryDisabled: <PrimaryButton disabled>Click me</PrimaryButton>,
  secondary: <SecondaryButton>Click me</SecondaryButton>,
  secondaryDisabled: <SecondaryButton disabled>Click me</SecondaryButton>
};
```

The object property names will show up as fixture names in the Cosmos UI.

> [See this comment](https://github.com/react-cosmos/react-cosmos/issues/924#issuecomment-462082405) for the reasoning behind this solution (vs named exports).

### How to create fixture files

Two options:

1. End fixture file names with `.fixture.{js,jsx,ts,tsx}`
2. Put fixture files inside `__fixtures__`

Examples:

1. `blankState.fixture.js`
2. `__fixtures__/blankState.js`

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

### Migrating _proxies_

Migrating Cosmos Classic proxies to React Cosmos 5 is not intuitive. _Sorry for that!_ Check out the [nested decorators example](../example/NestedDecorators) and join the `#proxies-upgrade` [Slack](https://join-react-cosmos.now.sh/) channel to learn more about this and to get help with your migration.

### Redux state mock

Check out [react-cosmos-redux](https://github.com/skidding/react-cosmos-redux) to see what an advanced React Cosmos decorator looks like.

## Declarative mocks

Coming up with dummy prop values is all that's required to create fixtures for many components. In other cases, however, components have _special needs_.

Some components need to be wrapped in certain _contexts_, like a Router provider. Other components fire `fetch` requests willy-nilly. All these implicit dependencies are component inputs and understanding them goes a long way.

The [react-mock](https://github.com/skidding/react-mock) project provides ways for mocking implicit component dependencies and helps you create fixtures for _stubborn_ components.

## UI-controlled values

The [props panel](https://twitter.com/ReactCosmos/status/1139838627976843264) allows you to manipulate component props visually by default. But you can also get a _custom values panel_ with minimal work.

```jsx
// CounterButton.fixture.js
import { useValue } from 'react-cosmos/fixture';

export default () => {
  const [count, setCount] = useValue('count', { defaultValue: 0 });
  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

> Heads up: `useValue` (and Cosmos in general) works great with TypeScript.

## UI plugins

A main feature of the React Cosmos redesign is the brand-new UI plugin architecture. While the new UI is created 100% from plugins, the plugin API is not yet documented nor made accessible. It will take a few big steps to get there, but this is the future.

### Custom [responsive viewports](https://twitter.com/ReactCosmos/status/1158701342208208897)

`responsivePreview` is a plugin included by default, and you can customize it through the Cosmos config.

```json
{
  "ui": {
    "responsivePreview": {
      "devices": [
        { "label": "iPhone 5", "width": 320, "height": 568 },
        { "label": "iPhone 6", "width": 375, "height": 667 },
        { "label": "iPhone 6 Plus", "width": 414, "height": 736 },
        { "label": "Medium", "width": 1024, "height": 768 },
        { "label": "Large", "width": 1440, "height": 900 },
        { "label": "1080p", "width": 1920, "height": 1080 }
      ]
    }
  }
}
```

## Static export

Run `cosmos-export` and get a nice component library that you can deploy to any static hosting service. The exported version won't have all the Cosmos features available in development (like opening the selected fixture in your code editor), but allows anybody with access to the static export URL to browse fixtures and play with component inputs.

> Use [http-server](https://github.com/indexzero/http-server) or any static file server to load the export locally.

## React Native

```
npm run cosmos-native
```

React Cosmos works great with React Native. Put the following inside `App.js` to get started.

```jsx
import React, { Component } from 'react';
import { NativeFixtureLoader } from 'react-cosmos/native';
// You generate cosmos.userdeps.js when you start the Cosmos server
import { rendererConfig, fixtures, decorators } from './cosmos.userdeps';

export default class App extends Component {
  render() {
    return (
      <NativeFixtureLoader
        rendererConfig={rendererConfig}
        fixtures={fixtures}
        decorators={decorators}
      />
    );
  }
}
```

Once your fixtures are loading properly, you'll probably want to split your App entry point to load Cosmos in development and your root component in production. Something like this:

```js
module.exports = global.__DEV__
  ? require('./App.cosmos')
  : require('./App.main');
```

**IMPORTANT:** React Native blacklists `__fixtures__` dirs by default. Unless you configure Cosmos to use a different directory pattern, you need to [override `getBlacklistRE` in the React Native CLI config](https://github.com/skidding/jobs-done/blob/585b1c472a123c9221dfec9018c9fa1e976d715e/rn-cli.config.js).

### React Native for Web

Run `cosmos --external-userdeps` instead of `cosmos-native` and Cosmos will [mirror your fixtures on both DOM and Native renderers](https://twitter.com/ReactCosmos/status/1156147491026472964).

## Server-side APIs

> Do **NOT** use these APIs in your fixture files, or any of your client code, as they require access to the file system and may bundle unwanted Node code in your client build.

### Config

Fetching a Cosmos config can be done in a number of ways, depending on whether or not you have a config file and, in case you do, if you prefer to specify the path manually or to rely on automatic detection.

#### Detect existing config based on cwd

`detectCosmosConfig` uses the same config detection strategy as the `cosmos` command.

```js
import { detectCosmosConfig } from 'react-cosmos';

const cosmosConfig = detectCosmosConfig();
```

#### Read existing config at exact path

`getCosmosConfigAtPath` is best when you don't want to care where you run a script from.

```js
import { getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));
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

### Fixture URLs

A list with one Playground URL for each fixture, optionally in full-screen mode. A common use case for `getFixtureUrls` is to create visual snapshots for each fixture, and potentially to diff them between deploys.

```js
import { getFixtureUrls } from 'react-cosmos';

const fixtureUrls = await getFixtureUrls({ cosmosConfig, fullScreen: true });

console.log(fixtureUrls);
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22\_\_fixtures\_\_%2FHello%20World.ts%22%2C%22name%22%3Anull%7D
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22\_\_fixtures\_\_%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22\_\_fixtures\_\_%2FState%20Playground.tsx%22%2C%22name%22%3Anull%7D
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D
// localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D
// ...
```

### Fixture elements (rendered anywhere)

A list of fixture elements to render by hand. A common use case for `getFixtures` is to run snapshot tests in alternative environments like jsdom.

```js
import { getFixtures } from 'react-cosmos';

const fixtures = await getFixtures({ cosmosConfig });

fixtures.forEach(({ fixtureId, getElement }) => {
  const renderer = create(getElement());
  expect(renderer.toJSON()).toMatchSnapshot(stringifyFixtureId(fixtureId));
});
```

Check out the [full example](https://github.com/react-cosmos/react-cosmos/blob/41f0b6972fd0cb2951c43839f4c37a6cf1881571/example/fixtures.test.ts) for more details on how to use the `getFixtures` API.

## Troubleshooting

> **Warning**: Most React Cosmos issues are related to missing build dependencies. Please see [Compilation](#compilation).

#### localhost:5000/\_renderer.html 404s?

- Check for build errors in your terminal.
- Make sure you have html-webpack-plugin installed, as well as [any other build dependency](#compilation).

#### Using Create React App?

- Set `webpack.configPath` to `react-scripts/config/webpack.config`. See example in [custom webpack config](#custom-webpack-config).
- Make sure to place fixture and decorator files in the `src` directory.

#### Using Next.js?

- [Make sure you have html-webpack-plugin installed](https://github.com/react-cosmos/react-cosmos/issues/995#issuecomment-511883135).
- [Override your webpack config with ProvidePlugin to support JSX without importing React](https://github.com/react-cosmos/react-cosmos/issues/1000#issuecomment-512575593).

#### "Failed to execute postMessage..."?

- [You may have a URL instance in your state](https://github.com/react-cosmos/react-cosmos/issues/1002).

#### "localhost:3001/\_\_get-internal-source..." 404s?

- [Try changing your webpack `devtool` to something like `cheap-module-source-map`](https://github.com/react-cosmos/react-cosmos/issues/1045#issuecomment-535150617).

## Where's my old Cosmos?

Cosmos Classic packages have been moved to [a dedicated repo](https://github.com/react-cosmos/react-cosmos-classic), which means we can continue to maintain Cosmos Classic or even run it alongside React Cosmos 5 in the same project (during the migration period).

That said, it's ideal for all Cosmos users to use the latest version. Please [let me know](https://join-react-cosmos.now.sh/) if you need help upgrading.

---

[Join us on Slack](https://join-react-cosmos.now.sh/) for feedback and questions.
