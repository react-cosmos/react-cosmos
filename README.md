# React Cosmos [![Build Status](https://travis-ci.org/skidding/cosmos.svg?branch=master)](https://travis-ci.org/skidding/cosmos) [![Coverage Status](https://coveralls.io/repos/skidding/cosmos/badge.svg?branch=master)](https://coveralls.io/r/skidding/cosmos?branch=master)

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

![Component Playground](https://cloud.githubusercontent.com/assets/250750/8532005/e6d3b3bc-2433-11e5-9fc3-39a9288198e9.gif)

_\*DX stands for Developer Experience, the counterpart of UX in building a product, system or service._

### Requirements

- [x] You should already be using CommonJS modules to structure your code and [webpack](http://webpack.github.io/) to bundle your modules for the browser.
- [ ] You need to create [fixtures](http://en.wikipedia.org/wiki/Test_fixture) for each set of props and states you want to load your components with. You can do this after you get started.

### Usage

See [Flatris](https://github.com/skidding/flatris) for a complete example. In the meantime you can toy with the dev setup from this repo to get started. Better docs coming soon.

### Development

Prerequisites:
```bash
npm install
npm install -g lerna@^2.0.0beta
npm run bootstrap
```

Start playground instance, built from source:
```bash
npm start
```

Work on a specific module (with playground re-bundling on file change):
```bash
npm run build:component-tree -- -- -w
npm start
```

Build everything with an older React version: 👌
```bash
npm run install-react:0.13
npm start
```

Run tests from all packages:
```bash
npm test
```

### Thank you for your interest!

[![Join the chat at https://gitter.im/skidding/cosmos](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/skidding/cosmos?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Explore the [Contributing Guide](CONTRIBUTING.md) for more information.

*Thanks to [Kreativa Studio](http://www.kreativa-studio.com/) for the Cosmos logo.*
