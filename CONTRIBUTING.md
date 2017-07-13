## Mission

To scale UI development linearly by prioritising on component design in isolation.

At the core is the assumption that complexity in large apps stems from hidden links between parts. Tedious as it can be to uncover each and every component dependency, committing to it promises predictability and long term sanity.

Moreover, React Cosmos tries to answer the question: **How to design components that are truly reusable?**

*For more context see [manifesto](https://github.com/react-cosmos/react-cosmos/wiki/Manifesto) and [problem analysis](https://github.com/react-cosmos/react-cosmos/wiki/Problem) written back in 2014, before code was written.*

## Design

[The Best Code is No Code At All.](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Start with this in mind before writing code.

### Monorepo

React Cosmos is a [monorepo](packages) powered by [Lerna](https://github.com/lerna/lerna). The monorepo structure makes it possible to publish independent packages while being able to have end-to-end tests for the whole project, and to easily link examples to unpublished packages.

Important to note:

- **Test and build tools are installed globally in the root node_modules.** This includes Jest, Babel, webpack, and their corresponding plugins and loaders. ESLint is also applied globally. Creating a new package has less overhead because of this.

- **React and webpack deps are installed globally in the root node_modules.** The linked packages and examples are sibling directories, so they each have a separate node_modules dir. But, when Cosmos packages are installed in a user codebase, they all share a common node_modules. We simulate the real life scenario by deduplicate these dependencies.

Because of the latter, integration tests or examples for older React or webpack version are not possible inside the monorepo. We should create external repos for testing React 0.14.x or webpack 1.x.

### Playground ⇆ Loader communication

The Cosmos UI is made out of two frames. Components are loaded inside an `iframe` for full encapsulation. Because the Playground and the Loader aren't part of the same frame, we use `postMessage` to communicate back and forth.

#### Playground to Loader

##### User selects fixture

```js
{
  type: 'fixtureSelect',
  component: 'Message',
  fixture: 'multiline'
}
```
##### User edits fixture body inside editor

```js
{
  type: 'fixtureEdit',
  fixtureBody: {
    // serializable stuff
  }
}
```

#### Loader to Playground

##### Loader frame loads and is ready to receive messages

Includes user fixture list. Happens once per full browser refresh.

```js
{
  type: 'loaderReady',
  fixtures: {
    ComponentA: ['fixture1', 'fixture2'],
  }
}
```

##### Fixture list updats due to changes on disk

webpack HMR updates Loader with the latest fixture list.

```js
{
  type: 'fixtureListUpdate',
  fixtures: {
    ComponentA: ['fixture1', 'fixture2', 'fixture3']
  }
}
```

##### Fixture loads

Serializable fixture body is attached, which the Playground uses for the fixture editor.

```js
{
  type: 'fixtureLoad',
  fixtureBody: {
    // serializable stuff
  }
}
```

##### Fixture updates

Due to state changes (local state, Redux or custom) or due to changes on disk (received by Loader via webpack HMR).

```js
{
  type: 'fixtureUpdate',
  fixtureBody: {
    // serializable stuff
  }
}
```

#### Order of events

Init:

1. Playground renders in loading state and Loader `<iframe>` is added to DOM
1. Loader renders inside iframe and sends `loaderReady` event to *window.parent*, along with user fixture list
1. Playground receives `loaderReady` event, puts fixture list in state and exits the loading state

Selecting fixture:

1. Playground sends `fixtureSelect` event to Loader with the selected component + fixture pair
1. Loader receives `fixtureSelect` and renders corresponding component fixture (wrapped in user configured Proxy chain)
1. User component renders, callback `ref` is bubbled up to Loader and `fixtureLoad` event is sent to Playground together with the serializable body of the selected fixture
1. Playground receives serializable fixture body, puts it in state and uses it as the JSON contents of the fixture editor

## Progress

[Projects](https://github.com/react-cosmos/react-cosmos/projects) are used to track large releases. [Issues](https://github.com/react-cosmos/react-cosmos/issues) are used for everything else.

#### Issue labels

Issues are first categorised as one of the following:
- `hmm` Questions and support
- `oops` Bugs
- `i have a dream` Ideas and feature proposals

Once a draft progresses, it will go through the following phases:
- `needs love` Accepted ideas without a clear implementation plan
- `free for all` Detailed issues that can be picked up by anyone
- `on it` Work in progress

## How to contribute

A great way to start is by picking up a [`free for all`](https://github.com/react-cosmos/react-cosmos/issues?q=is%3Aopen+is%3Aissue+label%3A%22free+for+all%22) issue.

#### Be kind and thoughtful

Most of us are doing this for free, so be realistic and don't expect special treatment. The better we communicate the more likely we'll end up collaborating.

#### Ask for review

Code review aside, also ask for review *before* implementing solution. Saves everybody time and effort.

#### Get familiar with codebase

Make sure you have [Yarn](https://yarnpkg.com/) installed. We use it to install dependencies faster and more reliably.

```bash
git clone git@github.com:react-cosmos/react-cosmos.git
cd react-cosmos

# Install deps and link child packages (using Lerna)
yarn

# Optional: build everything using older React versions
yarn run install-react:0.14

# Build example from source and test React Cosmos holistically
cd examples/context
yarn
yarn start

# Watch & build single package (running example will live reload)
yarn run build react-cosmos-component-playground -- --watch

# Watch & run unit tests as you code
yarn run test-jest -- --watch
```

#### Write tests, preferably before implementation

Use [Jest](https://facebook.github.io/jest/) for unit testing. Here are some examples:
- [Tests for react-cosmos-redux-proxy](packages/react-cosmos-redux-proxy/src/__tests__/index.js)
- [Tests for react-cosmos-webpack](packages/react-cosmos-webpack/src/__tests__)

Older packages are tested with Mocha and Karma, but those tests are considered legacy.

#### Keep coding style consistent

Make sure `yarn run lint` passes and add [xo](https://github.com/sindresorhus/xo) to your editor if possible.

#### Use Git conscientiously

Nothing fancy, just the usual the [GitHub flow.](https://guides.github.com/introduction/flow/)

---

Please note that this project is released with a [Contributor Code of Conduct.](CODE_OF_CONDUCT.md) By participating in this project you agree to abide by its terms.
