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

Read the story of React Cosmos: [Fighting for Component Independence](https://medium.com/@skidding/fighting-for-component-independence-2a762ee53272)

## Requirements

- [x] Node >=5 (older versions might work but aren't guaranteed)
- [x] React >=0.14.9
- [x] webpack or Browserify (or go rogue and roll your own integration)
- [ ] [Fixtures](#fixtures) to define states for your components (you'll do this after you get started)

## Usage

React Cosmos works best with webpack. Making it work with other bundlers takes extra work, but a complete [Browserify example](examples/browserify) is available.

Jump to:

- [Getting started](#getting-started)
- [Fixtures](#fixtures)
  - [What's a fixture?](#whats-a-fixture)
  - [Where to put fixtures?](#where-to-put-fixtures)
- [Proxies](#proxies)
  - [What's a proxy?](#whats-a-proxy)
  - [Redux](#redux)
  - [Context](#context)
- [Integration with popular tools](#integration-with-popular-tools)
  - [Create React App](#create-react-app)
  - [Next.js](#nextjs)
  - [React Redux Starter Kit](#react-redux-starter-kit)
- [Configuration](#configuration)
  - [Loader index.html](#loader-indexhtml)
  - [Custom config path](#custom-config-path)
  - [Custom component paths](#custom-component-paths)
  - [Option dump](#option-dump)
- [Exporting](#exporting)

*Have a question or idea to share? See you on [Slack](https://join-react-cosmos.now.sh/).*

### Getting started

```bash
npm install --dev react-cosmos-webpack
# or
yarn add --dev react-cosmos-webpack
```

Add `cosmos.config.js` to your project root

```js
module.exports = {
  componentPaths: ['src/components'],
};
```

Add script to package.json

```js
"scripts": {
  "cosmos": "NODE_ENV=development cosmos"
}
```

Run `npm run cosmos` or `yarn cosmos` and go to [localhost:8989](http://localhost:8989) 🎉

#### Next steps

- See [popular integrations](#integration-with-popular-tools) (e.g. CRA or Next.js)
- Extend your [config](#configuration)
- Create [fixtures](#fixtures)
- Configure or create [proxies](#proxies) (e.g. Redux)
- Be kind and [report what went wrong](https://github.com/react-cosmos/react-cosmos/issues)

### Fixtures

#### What's a fixture?

A fixture is a component mock. An example of component input. The input can be props, state, or–with the help of [proxies](#proxies)–anything a component depends upon (e.g. API responses).

```js
export default {
  props: {
    value: 'Lorem ipsum',
    disabled: true,
    onChange: value => console.log(`Select: ${value}`)
  }
}
```

Follow this [guide](docs/fixtures.md) to get started with fixtures.

#### Where to put fixtures?

Cosmos looks for `__fixtures__` dirs next to your components. Here are a few of the supported patterns.

##### Flat hierarchy

```bash
components/Button.jsx
components/nested/Dropdown.jsx
components/__fixtures__/Button/default.js
components/__fixtures__/Button/disabled.js
components/__fixtures__/nested/Dropdown/default.js
components/__fixtures__/nested/Dropdown/open.js
```

##### Nested hierarchy

```bash
components/Button/index.jsx
components/Button/__fixtures__/default.js
components/Button/__fixtures__/disabled.js
components/nested/Dropdown/index.jsx
components/nested/Dropdown/__fixtures__/default.js
components/nested/Dropdown/__fixtures__/open.js
```

Named component files also work in the nested hierarchy (i.e. `Button/Button.jsx` and `nested/Dropdown/Dropdown.jsx`).

### Proxies

#### What's a proxy?

Proxies are Cosmos plugins, allowing fixtures to go beyond mocking *props* and *state*. As regular React components, proxies compose in the order they are listed in your config and decorate the loaded component, respecting the contract to render the next proxy in the chain.

The added functionality can range from mocking Redux state to creating a resizable viewport for seeing how components behave at different scales.

#### Redux

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

#### Context

Very convenient if your app uses [React context](https://facebook.github.io/react/docs/context.html). You can provide generic context using a base fixture that all other fixtures extend.

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

### Integration with popular tools

#### Create React App

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
- Run `cosmos` with `NODE_ENV=development`
- Put [proxies](#proxies) in the `src` dir–the only place included by the CRA Babel loader

*CRA + Cosmos example: [Flatris](https://github.com/skidding/flatris)*

#### Next.js

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

#### React Redux Starter Kit

It's preferred to use the starter kit's own webpack config (instead of duplicating it).

```js
// cosmos.config.js
module.exports = {
  componentPaths: [
    'src/routes/Counter/components',
    'src/routes/Home/components'
  ],
  webpackConfigPath: 'build/webpack.config.js'
}
```

Also make sure to:
- Run `cosmos` with `NODE_ENV=development`
- Set up the [Redux proxy](#react-cosmos-context-proxy) :)

### Configuration

#### Loader index.html

> *GET http://localhost:8989/loader/index.html 404 (Not Found)*

The browser console might greet you with this error when using a custom webpack config. There are two methods for configuring the Loader index.html page:

1. Use [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)
2. Put a static index.html file in your public path (see `publicPath` option below)

**Using `html-webpack-plugin` is recommended** because it automatically injects the `<script>` tag in index.html. If you create your own index.html then make sure the script tag points to "main.js".

```html
<script src="./main.js"></script>
```

#### Custom config path

Use the `--config` CLI arg if you prefer not placing the config in the project root.

```js
// package.json
"scripts": {
  "cosmos": "NODE_ENV=development cosmos --config path/to/cosmos.config.js"
}
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

> The `getComponentName` option needs to be added when using file paths.

We can also use [glob](https://github.com/isaacs/node-glob) instead of adding each component by hand:

```js
// cosmos.config.js
componentPaths: glob.sync('src/components/*.jsx')
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

  // Enable hot module replacement.
  hot: true,

  // These ones are self explanatory
  hostname: 'localhost',
  port: 8989,
  webpackConfigPath: './config/webpack.config.dev',
};
```

### Exporting

Static Component Playground? Piece of 🍰! Add this script and run `npm run cosmos-export` or `yarn cosmos-export`.

```js
// package.json
"scripts": {
  "cosmos-export": "NODE_ENV=production cosmos-export"
}
```

## Join the component revolution!

This project welcomes all. Check out the [Contributing Guide](CONTRIBUTING.md) to read about the project's mission and how to get involved. Ask anything on [Slack](https://join-react-cosmos.now.sh/). Let's make UI development fun!

Thanks to [Kreativa Studio](http://www.kreativa-studio.com/) for the Cosmos logo.
