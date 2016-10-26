## Mission

To scale UI development linearly by prioritising on component design in isolation.

At the core is the assumption that complexity in large apps stems from hidden links between parts. Tedious as it can be to uncover each and every component dependency, committing to it promises predictability and long term sanity.

Moreover, React Cosmos tries to answer the question: **How to design components that are truly encapsulated?**

*For more context see [manifesto](https://github.com/react-cosmos/react-cosmos/wiki/Manifesto) and [problem analysis](https://github.com/react-cosmos/react-cosmos/wiki/Problem) written back in 2014, before code was written.*

## Design

[The Best Code is No Code At All.](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Start with this in mind before writing code.

React Cosmos is [monorepo](packages) with many small packages. This makes it possible to design isolated units, but also to build and test all packages together (inside one of the [examples](examples)).

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

```bash
git clone git@github.com:react-cosmos/react-cosmos.git
cd react-cosmos

# Install deps and link child packages (using Lerna)
npm install

# Optional: build everything using older React versions
npm run install-react:0.13

# Build example from source and test React Cosmos holistically
cd examples/flatris
npm install
npm start

# Watch & build single package (running example will live reload)
npm run build:component-playground -- -- --watch

# Watch & run unit tests as you code
npm run test-jest -- --watch
```

#### Write tests, preferably before implementation

Use [Jest](https://facebook.github.io/jest/) for unit testing. Here are some examples:
- [Tests for react-cosmos-redux-proxy](packages/react-cosmos-redux-proxy/src/__tests__/index.jsx)
- [Tests for react-cosmos-webpack](packages/react-cosmos-webpack/src/__tests__)

Older packages are tested with Mocha and Karma, but those tests are considered legacy.

#### Respect the [Airbnb Style Guide](https://github.com/airbnb/javascript)

Make sure your code editor has ESLint installed.

#### Use Git conscientiously

Nothing fancy, just the usual the [GitHub flow.](https://guides.github.com/introduction/flow/)

#### Write meaningful commits

Use the imperative mood to express verbs and add a hashtag with the corresponding issue number at the end of each commit message. The GitHub UI will generate links to the referenced issues.

> Adapt fixture mapping to new Component Playground format [#115](https://github.com/react-cosmos/react-cosmos/issues/115)
