## Mission

To scale UI development linearly by prioritising on component design in isolation.

At the core is the assumption that complexity in large apps stems from hidden links between parts. Tedious as it can be to uncover each and every component dependency, committing to it promises predictability and long term sanity.

Moreover, React Cosmos tries to answer the question: **How to design components that are truly reusable?**

*For more context see [manifesto](https://github.com/react-cosmos/react-cosmos/wiki/Manifesto) and [problem analysis](https://github.com/react-cosmos/react-cosmos/wiki/Problem) written back in 2014, before code was written.*

## Design

[The Best Code is No Code At All.](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Start with this in mind before writing code.

React Cosmos is a [monorepo](packages) with many small packages. This makes it possible to design isolated units, but also to build and test all packages together (inside one of the [examples](examples)).

### Playground ⇆ Loader communication

The Cosmos UI is built out of two frames (both conceptually but also literally–components are loaded inside an `iframe` for maximum encapsulation). Because the Playground and the Loader aren't part of the same frame, we use `postMessage` to communicate back and forth.

From Playground to Loader:

- User selects fixture
  ```js
  {
    type: 'fixtureSelect',
    component: 'Message',
    fixture: 'multiline'
  }
  ```
- User edits fixture contents inside editor
  ```js
  {
    type: 'fixtureEdit',
    fixtureContents: {
      // serializable stuff
    }
  }
  ```

From Loader to Playground:

- Loader frame loads and is ready to receive messages (happens once per full browser refresh)
  ```js
  {
    type: `loaderReady`
  }
  ```
- Serializable part of fixture contents is sent to Playground (to use in fixture editor), sent right after an incoming `fixtureSelect` event
  ```js
  {
    type: `fixtureLoad`,
    fixtureContents: {
      // serializable stuff
    }
  }
  ```
- Component state changes (local state, Redux or custom)
  ```js
  {
    type: `stateChange`,
    fixtureContents: {
      // serializable stuff
    }
  }
  ```

Order of events at init:

1. Playground renders and Loader `<iframe>` is added to DOM
1. Loader renders inside iframe and sends `loaderReady` event to *window.parent*
1. Playground receives `loaderReady` event and immediately sends `fixtureSelect` event to the loader frame, if any of two cases are met:
    - User quickly selects fixture before Loader is ready (edge-case)
    - The Cosmos URL already contains a selected fixture
1. *If fixture is selected...*
1. Loader immediately sends `fixtureLoad` event to playground with the serializable part of the selected fixture
1. Playground receives fixture contents via `fixtureLoad` and puts it inside local state
1. Serializable fixture contents show up in fixture editor


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
yarn run build react-component-playground -- --watch

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
