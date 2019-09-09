<p align="center">
  <img alt="Cosmos" src="cosmos.png">
</p>

# React Cosmos

[![npm version](https://img.shields.io/npm/v/react-cosmos/next.svg?style=flat)](https://www.npmjs.com/package/react-cosmos) [![CircleCI Status](https://circleci.com/gh/react-cosmos/react-cosmos.svg?style=shield)](https://circleci.com/gh/react-cosmos/react-cosmos) [![Twitter](https://img.shields.io/twitter/follow/ReactCosmos.svg?color=%2338A1F3&label=twitter&style=flat)](https://twitter.com/ReactCosmos) [![Slack](https://join-react-cosmos.now.sh/badge.svg)](https://join-react-cosmos.now.sh/) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/react-cosmos/react-cosmos/blob/master/CONTRIBUTING.md#how-to-contribute)

> [Become a Sponsor](https://github.com/users/skidding/sponsorship) to invest in the future of React Cosmos

A tool for ambitious UI developers.

- **Laser focus.** Isolate the components you're working on and iterate quickly. Works for both UI primitives and entire app sections. Running your whole app on every change is slowing you down!
- **Component library.** From blank states to normal states to edge cases, define component states to come back to. Your component library helps you stay organized and makes a great foundation of _test cases_.
- **Long term design.** Keeping your components decoupled leads to reusable code, a robust architecture, and saves you from having to rewrite your UI every two years.

**Install `react-cosmos@next` to get started.**

```
npm run cosmos
```

![Cosmos Next](next.png)

The [example package](example) is a useful complement to this guide.

## Table of contents

- Setup: [Requirements](#requirements) · [Config](#config) · [Webpack](#webpack)
- Usage: [Fixtures](#jsx-fixtures) · [Decorators](#decorators) · [Declarative mocks](#declarative-mocks) · [UI controls](#ui-controlled-values) · [UI plugins](#ui-plugins) · [React Native](#react-native) · [Server-side APIs](#server-side-apis)
- FAQ: [Troubleshooting](#troubleshooting) · [Where's my old Cosmos?](#wheres-my-old-cosmos) · [Why Cosmos?](#why-cosmos) · [Credits](#credits)

## Requirements

The only hard requirements are React 16.8 and Node 6 (or newer).

React Cosmos works best with webpack. It takes extra effort to make it work with other bundlers, but it's not as scary as it might seem. Don’t be afraid to ask for support.

> [Browserify](https://github.com/react-cosmos/react-cosmos-classic/tree/14e1a258f746df401a41ab65429df0d296b910e4/examples/browserify) and [Parcel](https://github.com/react-cosmos/parcel-ts-example) examples are available for Cosmos Classic. Props to whoever adapts them to Cosmos Next!

### Compilation

How you compile your code is 100% your business. React Cosmos jumps through hoops to compile your code using your existing build pipeline, but it doesn't have opinions nor does it install dependencies your setup might require.

Unless you use a framework like Create React App or Next.js, install build dependencies yourself. This include stuff like Babel, TypeScript, webpack loaders, etc. **Cosmos uses build dependencies already installed in your project.**

## Config

No config is required to start. If you have custom needs or would like to convert a Cosmos Classic config, here's what you need to know.

The Cosmos Next config is a **JSON** file, so it can only host serializable values. This design decision is meant to discourage complex configuration, make it easy to embed config options into the UI, and enable visual config management in the future.

By default, Cosmos reads `cosmos.config.json` from your root directory. You can pass a `--config` CLI arg for a custom config path.

> Most Cosmos Classic config options are still supported in the new JSON format. [Let me know](https://join-react-cosmos.now.sh/) if you need old config options that no longer work.

### Available options

The best way to learn about the available options in the Cosmos config is to use [config.schema.json](packages/react-cosmos/config.schema.json).

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

## JSX fixtures

Cosmos Next introduces a more natural format for component fixtures: **React elements** and **React functions.**

Some advantages compared to the old format in Cosmos Classic:

- Fixtures are no longer bound to a single component
- Adding one or more component wrappers per fixture is easy
- Fixtures can be copy pasted inside the project source code
- Props are easier to type-check
- Writing fixtures doesn't feel like writing code for Cosmos

The new fixtures formats also come with a minor drawback: `React` must be imported in every fixture file.

### Element fixtures

> Think of Element fixtures as the return value of a render function, or the first argument to `React.render`.

```jsx
// __fixtures__/disabled.js
export default <Button disabled>Click me</Button>;
```

### Function fixtures

Function fixtures are like a component with no props. They enable using Hooks inside fixtures, which is powerful for simulating state with stateless components.

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

Wrapping components inside JSX fixtures is easy, but can become repetitive. _Decorators_ can be used to apply one or more component wrappers to a group of fixtures automatically.

A `cosmos.decorator` file looks like this:

```jsx
// cosmos.decorator.js
export default ({ children }) => <Provider store={store}>{children}</Provider>;
```

> A decorator file only applies to fixture files that are contained in the decorator file's directory. Multiple decorator files can be composed, in the order of their position in the file system hierarchy (from outer to inner).

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
  const [count, setCount] = useValue(0);
  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

> Heads up: `useValue` (and Cosmos in general) works great with TypeScript.

### Redux state mock

Check out [react-cosmos-redux](https://github.com/skidding/react-cosmos-redux) to see what a Cosmos Next decorator looks like.

## UI plugins

A main feature of the Cosmos Next redesign is the brand-new UI plugin architecture. While the new UI is created 100% from plugins, the plugin API is not yet documented nor made accessible. It will take a few big steps to get there, but this is the future.

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

## React Native

```
npm run cosmos-native
```

Cosmos Next works great with React Native. Put the following inside `App.js` to get started.

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

> Using React Native for Web? Run `cosmos --external-userdeps` instead of `cosmos-native` and Cosmos will [mirror your fixtures on both DOM and Native renderers](https://twitter.com/ReactCosmos/status/1156147491026472964).

Notes:

- React Native blacklists `__fixtures__` dirs by default. Unless you configure Cosmos to use a different directory pattern, you need to [override `getBlacklistRE` in the React Native CLI config](https://github.com/skidding/jobs-done/blob/585b1c472a123c9221dfec9018c9fa1e976d715e/rn-cli.config.js).

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
// localhost:5000/?fixtureId=%7B%22path%22%3A%22\_\_fixtures\_\_%2FHello%20World.ts%22%2C%22name%22%3Anull%7D&fullScreen=true
// localhost:5000/?fixtureId=%7B%22path%22%3A%22\_\_fixtures\_\_%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D&fullScreen=true
// localhost:5000/?fixtureId=%7B%22path%22%3A%22\_\_fixtures\_\_%2FState%20Playground.tsx%22%2C%22name%22%3Anull%7D&fullScreen=true
// localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D&fullScreen=true
// localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D&fullScreen=true
// localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D&fullScreen=true
// localhost:5000/?fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D&fullScreen=true
// localhost:5000/?fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D&fullScreen=true
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

#### Failed to execute `postMessage` [...]?

- [You may have a URL instance in your state](https://github.com/react-cosmos/react-cosmos/issues/1002)

#### Using Next.js?

- [Make sure you have html-webpack-plugin installed](https://github.com/react-cosmos/react-cosmos/issues/995#issuecomment-511883135)
- [Override your webpack config with ProvidePlugin to support JSX without importing React](https://github.com/react-cosmos/react-cosmos/issues/1000#issuecomment-512575593)

## Where's my old Cosmos?

Cosmos Classic packages have been moved to [a dedicated repo](https://github.com/react-cosmos/react-cosmos-classic), which means we can continue to maintain Cosmos Classic or even run it alongside Cosmos Next in the same project (during the migration period).

That said, it's ideal for all Cosmos users to use the latest version. Please [let me know](https://join-react-cosmos.now.sh/) if you need help upgrading.

## Why Cosmos?

Many other component-oriented tools have emerged since Cosmos was conceived. [Storybook](https://github.com/storybookjs/storybook) and [React Styleguidist](https://github.com/styleguidist/react-styleguidist) are good examples, but you can find an exhaustive list [here](https://react-styleguidist.js.org/docs/cookbook.html#are-there-any-other-projects-like-this). Choose the tool that matches your needs the most.

React Cosmos is a dev tool first, made to address all components, big and small, not just the stateless UI bits. It aims to boost developer productivity and lead to robust component APIs that survive the test of time.

You can also create a living style guide using React Cosmos, but it's a secondary goal and you might get more value from alternatives if this is your chief concern.

## Credits

Hi, this is [Ovidiu](https://twitter.com/skidding), the core maintainer of React Cosmos. I spend ridiculous amounts of time perfecting this project because I love building user interfaces and making useful stuff.

React Cosmos is licensed as MIT and will always be free. If you want to support me, however, [become a Sponsor](https://github.com/users/skidding/sponsorship) and ensure this journey continues indefinitely!

Special thanks to [@maxsalven](https://github.com/maxsalven) and [@xavxyz](https://github.com/xavxyz) for the long conversations and recurring interest in this project, as well as [@catalinmiron](https://github.com/catalinmiron), [@flaviusone](https://github.com/flaviusone), [@NiGhTTraX](https://github.com/NiGhTTraX), [@ovidiubute](https://github.com/ovidiubute), [@RadValentin](https://github.com/RadValentin), [@tkjone](https://github.com/tkjone), and all the other [contributors](https://github.com/react-cosmos/react-cosmos/graphs/contributors). You're a big reason why React Cosmos is still alive ❤️.

Shout-out to [Kreativa Studio](http://www.kreativa-studio.com/) for offering the Cosmos illustration for free!

---

For feedback [create a GitHub issue](https://github.com/react-cosmos/react-cosmos/issues/new) or [join us on Slack](https://join-react-cosmos.now.sh/).
