<p align="center">
  <img alt="Cosmos" src="cosmos.png">
</p>

<p align="center">
  <strong>React Cosmos</strong> ✭ DX tool for designing reusable <a href="http://facebook.github.io/react/">React</a> components
</p>

<p align="center">
  <a href="https://travis-ci.org/react-cosmos/react-cosmos">
    <img alt="Build status" src="https://travis-ci.org/react-cosmos/react-cosmos.svg?branch=master">
  </a>
  <a href="https://coveralls.io/r/react-cosmos/react-cosmos?branch=master">
    <img alt="Coverage status" src="https://coveralls.io/repos/react-cosmos/react-cosmos/badge.svg?branch=master">
  </a>
  <a href="https://join-react-cosmos.now.sh/">
    <img alt="Slack" src="https://join-react-cosmos.now.sh/badge.svg">
  </a>
  <a href="CONTRIBUTING.md#how-to-contribute">
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
  </a>
</p>

Cosmos scans your project for components and loads them inside [Component Playground](https://react-cosmos.github.io/),
enabling you to:

1. Render components under any combination of props, context and state
2. See state evolve in real-time while interacting with running
instances

![Component Playground](intro.gif)

> Working with Cosmos improves component design because it
surfaces implicit dependencies. It also forces you to define sane inputs
for your components, making them predictable and easier to debug down the
road.

Read the story of React Cosmos: [Fighting for Component Independence.](https://medium.com/@skidding/fighting-for-component-independence-2a762ee53272)

## Requirements

- [x] Node >=5 (older versions might work but aren't guaranteed)
- [x] React >=0.14.9
- [x] webpack or Browserify (or go rogue and roll your own)
- [ ] [Fixtures](https://github.com/skidding/flatris/tree/master/src/components/__fixtures__) to define states for your components (you'll do this after you get started)

## Usage

The easiest way to use React Cosmos is alongside webpack. Making it work with Browserify takes extra work, but a [complete example](examples/browserify) is available.

Jump to:

- [react-cosmos-webpack](#react-cosmos-webpack)
- [Proxies](#proxies)

*Have a question or idea to share? See you on [Slack](https://join-react-cosmos.now.sh/).*

### react-cosmos-webpack

Extends your existing webpack config (or uses a [default config](packages/react-cosmos-webpack/src/default-webpack-config.js)) and starts a dev server for Component Playground tuned to your codebase.

By default, it looks for a `__fixtures__` dir next to your components.

```bash
src/components/Button.jsx
src/components/__fixtures__/Button/default.js
src/components/__fixtures__/Button/disabled.js

# also works if you have one folder per component
src/components/Button/Button.jsx
src/components/Button/__fixtures__/default.js
src/components/Button/__fixtures__/disabled.js
```

Follow these steps to get started:

**1. Install package**

```bash
npm i -D react-cosmos-webpack
```

**2. Add `cosmos.config.js` to your project root**

```js
// cosmos.config.js
module.exports = {
  componentPaths: ['src/components'],
};
```

**3. Start and [load playground](http://localhost:8989)** 🎉

```bash
node_modules/.bin/cosmos
# or
node_modules/.bin/cosmos --config path/to/cosmos.config.js
```

Bonus: Create `npm run cosmos` script for extra sugar

```js
// package.json
"scripts": {
  "cosmos": "NODE_ENV=development cosmos"
}
```

**Voilà!** Now you can [extend your config](#configuration), start [creating fixtures](docs/fixtures.md) or be kind and [report what went wrong.](https://github.com/react-cosmos/react-cosmos/issues)

Also see:

- [Configuring index.html](#configuring-indexhtml)
- [Option dump](#option-dump)
- [Custom component paths](#custom-component-paths)
- [Using Create React App](#using-create-react-app)
- [Using React Redux Starter Kit](#using-react-redux-starter-kit)
- [Using Next.js](#using-nextjs)
- [Using webpack 2](#using-webpack-2)
- [Using babel-node](#using-babel-node)

#### Configuring index.html

> *GET http://localhost:8989/loader/index.html 404 (Not Found)*

The browser console might greet you with this error when using a custom webpack config. There are two methods for configuring the Loader index.html page:

1. Use [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)
2. Put a static index.html file in your public path (see `publicPath` option below)

**Using `html-webpack-plugin` is recommended** because it automatically injects the `<script>` tag in index.html. If you create your own index.html then make sure the script tag points to "main.js".

```html
<script src="./main.js"></script>
```

#### Option dump

Options supported by `cosmos.config.js`.

```js
// cosmos.config.js
module.exports = {
  // Read components from multiple locations. Useful for including Redux
  // containers or if you split your UI per sections.
  componentPaths: [
    'src/components',
    'src/containers'
  ],

  // Additional paths to search for fixtures, besides the __fixtures__ folder
  // nested inside component paths. Useful if you keep fixture files separated
  // from components files.
  fixturePaths: [
    'test/fixtures'
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

  // Read more about proxies below
  proxies: [
    './redux-proxy.js',
    './context-proxy.js',
  ],

  // Render inside custom root element. Useful if that root element already
  // has styles attached, but bad for encapsulation.
  containerQuerySelector: '#app',

  // Enable hot module replacement. Use together with `hmrPlugin` option
  // depending on your webpack configuration.
  hot: true,

  // Add webpack.HotModuleReplacementPlugin. Don't enable this if your webpack
  // config already adds it.
  hmrPlugin: true,

  // These ones are self explanatory
  hostname: 'localhost',
  port: 8989,
  webpackConfigPath: './config/webpack.config.dev',
};
```

#### Custom component paths

The `componentPaths` option supports both dir and file paths. Most of the times using a dir path is enough (e.g. "src/components"), but we might need to target the exact file paths when component files sit next to non-component files. Here's an example for this type of setup:

```js
// cosmos.config.js
componentPaths: [
  'src/components/A.jsx',
  'src/components/B.jsx'
],
getComponentName: componentPath =>
  componentPath.match(/src\/components\/(.+)\.jsx$/)[1]
```

> **Note: The `getComponentName` option needs to be added when using file paths.**

We can also use [glob](https://github.com/isaacs/node-glob) instead of adding each component by hand:

```js
// cosmos.config.js
componentPaths: glob.sync('src/components/*.jsx')
```

#### Using Create React App

It's preferred to use CRA's own webpack config (instead of duplicating it).

```js
// cosmos.config.js
module.exports = {
  componentPaths: ['src/components'],
  containerQuerySelector: '#root',
  webpackConfigPath: 'react-scripts/config/webpack.config.dev'
};
```

Also make sure to:
- Set `NODE_ENV=development` when running `cosmos`
- Put [proxies](#proxies) in the `src` dir, the only place included by the CRA Babel loader.

*CRA + Cosmos example: [Flatris](https://github.com/skidding/flatris)*

#### Using React Redux Starter Kit

It's preferred to use the starter kit's own webpack config `build/webpack.config.js` (instead of duplicating it), but modifications are needed.

Add a `__PLAYGROUND__` environment (~line 10)

```js
const __PLAYGROUND__ = project.env === 'playground'
```

Disable extractStyles when running in playground (~line 97)

```js
// old
  disable: __DEV__, 

// new
  disable: __DEV__ || __PLAYGROUND__,
```

Ensure bundle splitting doesn't happen when running in playground (~line 198)

```js
// old
if (!__TEST__) { 

// new
if (!__TEST__ && !__PLAYGROUND__) { 
```

Just run it with your `NODE_ENV` set to `playground` and all should be good! Don't forget to set up the redux proxy :)

#### Using Next.js

Next.js apps run on both client & server, so compilation is done via Babel plugins instead of webpack loaders. This means we can rely on Cosmos' default webpack config.

```js
// cosmos.config.js
module.exports = {
  componentPaths: ['components'],
};
```

Define `.babelrc` for the Cosmos webpack config to rely on the Next.js preset.

```json
{
  "presets": ["next/babel"],
}
```

*Next.js + Cosmos example: [Illustrated Algorithms](https://github.com/skidding/illustrated-algorithms)*

#### Using babel-node

Unless you pass it the `--plain` param, react-cosmos-webpack runs with `babel-node` by default. This is nice because it allows you to write your configs using the same syntax as your source code.

### Proxies

Proxies are a plugin system for React Cosmos, allowing fixtures to go beyond mocking *props* and *state*. As regular React components, they compose in the order they are listed in your config and decorate the functionality of the loaded component, while respecting the contract to render the next proxy in the chain.

The added functionality can range from mocking Redux state (or server requests made from your components) to creating a resizable viewport for seeing how components behave at different scales.

#### react-cosmos-redux-proxy

Most components in a Redux app depend on Redux state–either they're a *container* or one of their descendants is. This proxy creates the store context required for any component you load, just like [Provider](http://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store) does for your root component. Writing Redux fixtures almost feels too easy. Because Redux state is global, once you have one state mock you can render any component you want!

```js
// redux-proxy.js
import createReduxProxy from 'react-cosmos-redux-proxy';

export default () => {
  return createReduxProxy({
    // Called when fixture loads with fixture.reduxState as initial state.
    // See https://github.com/skidding/flatris/blob/master/cosmos/redux-proxy.js
    createStore: (initialState) => {
      return Redux.createStore(yourReducer, initialState, yourMiddleware);
    },
  })
};
```

#### react-cosmos-context-proxy

Very convenient if your app uses component context. You can provide generic context using a base fixture that all other fixtures extend.

```js
// context-proxy.js
import createContextProxy from 'react-cosmos-context-proxy';

export default () => {
  return createContextProxy({
    // Expects fixture.context to contain `theme` object
    // See examples/context
    childContextTypes: {
      theme: PropTypes.object.isRequired,
    },
  });
};
```

*What proxy would you create to improve DX?*

## Join the component revolution!

This project welcomes all. Check out the [Contributing Guide](CONTRIBUTING.md) to read about the project's mission and how to get involved. Ask anything on [Slack](https://join-react-cosmos.now.sh/). Let's make UI development fun!

Thanks to [Kreativa Studio](http://www.kreativa-studio.com/) for the Cosmos logo.
