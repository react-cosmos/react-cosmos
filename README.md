# Cosmos

Cosmos is a JavaScript DX* tool for designing truly encapsulated
[React](http://facebook.github.io/react/) components.

![Cosmos](cosmos-150.png)

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
- [x] You need to create fixtures for each set of props and states you want to load your components with.

### Installing

Cosmos used to be dev dependency binary, but has been transformed into a
webpack boilerplate. This makes it more customizable and easier to understand.
Check out the [webpack-boilerplate](webpack-boilerplate) folder for
instructions.

### Thank you for your interest!

[![Join the chat at https://gitter.im/skidding/cosmos](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/skidding/cosmos?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Explore the [Contributing Guide](CONTRIBUTING.md) for more information.

*Thanks to [Kreativa Studio](http://www.kreativa-studio.com/) for the Cosmos logo.*
