# Cosmos [![Build Status](https://travis-ci.org/skidding/cosmos.svg?branch=master)](https://travis-ci.org/skidding/cosmos) [![Coverage Status](https://coveralls.io/repos/skidding/cosmos/badge.svg?branch=master)](https://coveralls.io/r/skidding/cosmos?branch=master)

Cosmos is a [React](http://facebook.github.io/react/) development utility built
on top of:

1. [ComponentTree](https://github.com/skidding/react-component-tree) —
Serialize and reproduce the state of an entire tree of React components
2. [ComponentPlayground](https://github.com/skidding/react-component-playground)
— Minimal frame for loading and testing React components in isolation

![Component Playground](https://cloud.githubusercontent.com/assets/250750/7215709/7991ed62-e5ec-11e4-89db-25bab48f22b2.png)

### How do I use it?

```bash
npm install -g cosmos-js

cd /path/to/my/project
component-playground
```

Running the `component-playground` executable will:

1. Start a [webpack](http://webpack.github.io/) dev server, serving an instance
of ComponentPlayground at `localhost:8989`
2. Scan the current folder for components and fixtures and feed them to
ComponentPlayground

The webpack build bundles modules from both the current folder and the Cosmos
package. It is currently compatible with React classes, ES6 classes, JSX and
CSS/LESS modules. In the future the [webpack config](component-playground/webpack.config.js)
should be configurable.

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
component-playground --components-path src/components --fixtures-path tests/fixtures
```

### Thank you for your interest!

[![Join the chat at https://gitter.im/skidding/cosmos](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/skidding/cosmos?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Explore the [wiki](https://github.com/skidding/cosmos/wiki) for more info on
the Cosmos project.
