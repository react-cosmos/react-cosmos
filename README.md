# Cosmos

Cosmos is a JavaScript DX* tool for designing truly encapsulated
[React](http://facebook.github.io/react/) components.

It scans your project for React component
[_fixtures_](http://en.wikipedia.org/wiki/Test_fixture) and loads them inside [ComponentPlayground](https://github.com/skidding/react-component-playground),
enabling you to:

1. Render your components under any combination of props and state
2. See component states evolve in real-time as you interact with running
instances

> Working with ComponentPlayground improves the component design because it
surfaces any implicit dependencies. It also forces you to define sane inputs
for every component, making them more predictable and easier to debug down the
road.

![Component Playground](https://cloud.githubusercontent.com/assets/250750/8532005/e6d3b3bc-2433-11e5-9fc3-39a9288198e9.gif)

_\*DX stands for Developer Experience, the counterpart of UX in building a product, system or service._

### Requirements

- [x] You should already be using CommonJS modules to structure your code and
[webpack](http://webpack.github.io/) to bundle your modules for the browser
- [x] Your React components should be fully encapsulated. They should have no
global dependencies and rely exclusively on _props_ for input. Including styles,
which means you need to be using
[style-loader](https://github.com/webpack/style-loader).
- [x] You must create component fixtures for ComponentPlayground to load. The
component and fixture files should be nested as in the folder structure below.
See the [example repo](https://github.com/skidding/cosmos-example) for a better
picture.

### Installing

- Install the Cosmos package through npm `npm install cosmos-js`
- Run the ComponentPlayground executable `node_modules/.bin/component-playground`
- Open [localhost:8989](http://localhost:8989)

### Under the hood

Running the ComponentPlayground executable will:

1. Start a [webpack dev server](http://webpack.github.io/docs/webpack-dev-server.html),
serving an instance of ComponentPlayground at `localhost:8989`
2. Scan the current folder for components and fixtures and feed them to
ComponentPlayground

#### File structure

This is the file structure Cosmos expects:
```
|
+-- components
|   +-- FooComponent.jsx
|   +-- namespace
|   |   +-- BarComponent.jsx
+-- fixtures
|   +-- FooComponent
|   |   +-- default.js
|   |   +-- active.js
|   +-- namespace
|   |   +-- BarComponent
|   |       +-- default.js
|   |       +-- paused.js
```

If the _components_ and _fixtures_ folders are not siblings, their paths can be
specified via cli args:

```bash
node_modules/.bin/component-playground --components-path src/components --fixtures-path tests/fixtures
```

#### webpack config

The webpack build bundles modules from both the current folder and the Cosmos
package. It is compatible with React classes, ES6 classes, JSX and CSS/LESS
modules [out of the box](component-playground/config.js#L34-L76), but you can
customize the webpack config to support additional loaders and settings by
creating a `component-playground.config.js` file in the project root. E.g.

```js
module.exports.webpack = function(config) {
  config.module.loaders.push(/*...*/);
  return config;
};
```

You can use this functionality to inject external styles or scripts if your
components need e.g. Bootstrap to work.
```js
config.entry.push(path.join(process.cwd(), 'injectBootstrapTags.js'));
```

#### Hot loading

Cosmos includes [React Hot Loader](http://gaearon.github.io/react-hot-loader/)
and has webpack's [hot module replacement](http://webpack.github.io/docs/hot-module-replacement.html)
enabled so you can tweak the components and their styles without refreshing the
browser:

![React Hot Loader in Cosmos](https://cloud.githubusercontent.com/assets/250750/7526576/5c725b16-f51b-11e4-95ef-312c6fd7bcc7.gif)

### Thank you for your interest!

[![Join the chat at https://gitter.im/skidding/cosmos](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/skidding/cosmos?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Explore the [Contributing Guide](CONTRIBUTING.md) for more information.
