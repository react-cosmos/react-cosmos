# React Cosmos [![Build Status](https://travis-ci.org/react-cosmos/react-cosmos.svg?branch=master)](https://travis-ci.org/react-cosmos/react-cosmos) [![Coverage Status](https://coveralls.io/repos/react-cosmos/react-cosmos/badge.svg?branch=master)](https://coveralls.io/r/react-cosmos/react-cosmos?branch=master) [![Join the chat at https://gitter.im/skidding/cosmos](https://img.shields.io/gitter/room/gitterHQ/gitter.svg)](https://gitter.im/skidding/cosmos?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#how-to-contribute)

DX* tool for designing truly encapsulated
[React](http://facebook.github.io/react/) components.

![Cosmos](cosmos-150.png)

Cosmos scans your project for React components and loads them inside the [Component Playground](packages/react-component-playground),
enabling you to:

1. Render your components under any combination of props and state
2. See component states evolve in real-time as you interact with running
instances

> Working with Cosmos improves the component design because it
surfaces any implicit dependencies. It also forces you to define sane inputs
for every component, making them more predictable and easier to debug down the
road.

![Component Playground](intro.gif)

_\*DX stands for Developer Experience, the counterpart of UX in building a product, system or service._

## Requirements

- [x] Node >=5 and npm >=3. Older versions might work but aren't guaranteed.
- [x] You should already be using CommonJS modules to structure your code and [webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/) to bundle your modules for the browser.
- [x] React >=0.13.
- [ ] You need to create [fixtures](examples/flatris/src/components/__fixtures__) for each set of props and states you want to load your components with. You can do this after you get started.

## Usage

The easiest way to use React Cosmos is [alongside webpack](examples/flatris/webpack). Making it work with Browserify takes extra work, but a [complete example](examples/flatris/browserify) is available.

### webpack CLI

It extends your existing webpack config (*please tell me you have one*) and starts a dev server for Component Playground tuned to your codebase.

`react-cosmos-webpack` looks for a `__fixtures__` directory next to your components. E.g.
```bash
src/components/Button.jsx
src/components/__fixtures__/Button/default.js
src/components/__fixtures__/Button/disabled.js
```

Follow these steps to get started:

**Step 1: Install package**

```bash
npm i -D react-cosmos-webpack
```

**Step 2: Add `cosmos.config.js` to your project root**

```js
// cosmos.config.js
module.exports = {
  componentPaths: ['src/components'],
};
```

**Step 3: Start and [load playground](http://localhost:8989)** 🎉

```bash
node_modules/.bin/cosmos
# or
node_modules/.bin/cosmos --config path/to/cosmos.config.js
```

**Bonus: Create `npm run cosmos` script for extra sugar**

```js
// package.json
"scripts": {
  "cosmos": "cosmos"
}
```

Voilà! Now you can [extend your config](#configuration), start [creating fixtures](docs/fixtures.md) or be kind and [report what went wrong.](https://github.com/react-cosmos/react-cosmos/issues)

#### Configuration

All the options supported by `cosmos.config.js`.
```js
// cosmos.config.js
module.exports = {
  // Read components from multiple locations. Useful for including Redux
  // containers or if you split your UI per sections.
  componentPaths: [
    'src/components',
    'src/containers'
  ],

  // Additional entry points that should be present along with any component.
  // Sad, but inevitable.
  globalImports: [
    './reset.css',
    './global.css',
  ],

  // Components will not be loaded in the playground if their names match these.
  // There's no excuse for components that can't be loaded independently, but
  // if you store HoCs (which export functions) next to regular components, well,
  // what are you gonna do, not use this wonderful tool?
  ignore: [
    /notATrueComponent/,
    /itsComplicated/,
    /itsNotMeItsYou/,
  ],

  // Where to serve static files from. Like --content-base in webpack-dev-server.
  publicPath: 'src/public',

  // NEW: Plugin system for React Cosmos!
  // Here is how to activate Redux:
  proxies: [
    require('react-cosmos-redux-proxy')({
      // Called when fixture loads with `fixture.reduxState` as initial state.
      // See Flatris example for a complete Redux integration.
      createStore: (initialState) => {
        return Redux.createStore(yourReducer, initialState, yourMiddleware);
      },
    }),
  ],

  // WARNING: Make sure to add webpack.HotModuleReplacementPlugin to your
  // webpack config plugins section if you enable this. (and magic will ignite)
  hot: false,

  // These ones are self explanatory
  hostname: 'localhost',
  port: 8989,
  webpackConfigPath: './config/webpack.config.dev',
};
```

#### Using Babel

Unless you pass it the `--plain` param, the webpack CLI runs with `babel-node` by default. This is nice because it allows you to write your fixtures and the webpack & Cosmos configs using the same syntax as your source code.

## Thanks!

Explore the [Contributing Guide](CONTRIBUTING.md) for more information.

*Thanks to [Kreativa Studio](http://www.kreativa-studio.com/) for the Cosmos logo.*
