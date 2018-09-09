Hello, fellow human!

You seem to be interested in the inner workings of Cosmos. Good news, we've been expecting you. Before continuing, we kindly ask you to respect the terms of the [Contributor Code of Conduct](CODE_OF_CONDUCT.md). Thanks!

Jump to:

- [Mission](#mission)
- [Roadmap](#roadmap)
- [Architecture](#architecture)
  - [Monorepo](#monorepo)
  - [Playground & Loader](#playground--loader-communication)
  - [webpack](#webpack)
- [Proxy boilerplate](#proxy-boilerplate)
  - [Testing proxies](#testing-proxies)
- [How to contribute](#how-to-contribute)

## Mission

**To preserve harmony in UI projects by making component reusability simple & fun.**

Cosmos is built on the assumption that complexity in large apps stems from hidden links between parts. Tedious as it can be to uncover each and every component dependency, committing to it promises predictability and long term sanity.

## Roadmap

Roadmap are high-level planning is found inside [TODO.md](TODO.md).

[Issues](https://github.com/react-cosmos/react-cosmos/issues) cover specific threads.

#### Issue labels

- `hmm` Questions and support
- `oops` Bugs
- `i have a dream` Feature proposals

Drafts progress through the following phases:

- `needs love` Require feedback and a sound plan
- `free for all` Ready to be picked up by anyone
- _Assigned_

## Architecture

[The Best Code is No Code At All.](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Start with this in mind before writing code.

### Monorepo

React Cosmos is a [monorepo](packages) powered by [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna). The monorepo structure makes it possible to publish independent packages while being able to have end-to-end tests for the whole project, and to easily link examples to unpublished packages.

Important to note:

- **Test and build tools are installed globally in the root node_modules.** This includes Jest, Babel, webpack, and their corresponding plugins and loaders. ESLint is also applied globally. Creating a new package has less overhead because of this.

- **React and webpack deps are installed globally in the root node_modules.** The linked packages and examples are sibling directories, so they each have a separate node_modules dir. But, when Cosmos packages are installed in a user codebase, they all share a common node_modules. We simulate the real life scenario by deduplicate these dependencies.

Because of the latter, integration tests or examples for older React or webpack version are not possible inside the monorepo. We should create external repos for testing React 0.14.x or webpack 1.x.

#### Compiled vs source code

Monorepo packages have source code under `packages/PACKAGE/src` and compiled code under `packages/PACKAGE/dist`. Each package has one or more _entry points_ (or zero in rare cases, like `react-cosmos-scripts` which exposes only binaries).

**Entry points** are ES5 modules that are published to npm as-in, and they only forward exports from package modules. `package.json#main` usually points the `index.js` entry point. But some packages have multiple entry points. Because they are placed at the root package level, _named_ entry points can be imported like this:

```js
import { moduleExists } from 'react-cosmos-shared/server';
```

The main benefit of this structure is that **we can at any time choose to link package entry points to either source or compiled modules.** This is powerful. Before we publish to npm, we make sure the entry points link to compiled output (the `dist` dir). When we develop, however, the entry points link to `src`, which enables the following:

- ~~**Flow types are carried over between packages.** So if package B calls an API from package A with incorrect arguments, Flow lets us know right away.~~ _Not anymore._ New packages have `*.js.flow` interfaces. Exposing individual package types is great for the most part, but if those types are out of sync with the source code Flow can detect false positives. We fix this by [generating Flow lib defs from source code automatically](https://github.com/react-cosmos/react-cosmos/blob/a961fbbb11cb275fa90a96a0a5d87dc2042ba4f5/DEBT.md#sharing-flow-types).
- **Tests always run against latest source.** In the past each package pointed to the compiled output of its monorepo dependencies. This made it easy to mistakenly run integration (cross-package) tests on part source code, part outdated compiled output.
- **In watch-mode, one change triggers tests across multiple packages.** Change something in `react-cosmos-shared` and a dozen packages are influenced. Because monorepo dependencies link to _src_, and because Jest is awesome, tests from all related packages are ran.
- **Test coverage is calculated correctly.** Cross-package integration tests count coverage in all the packages they touch, not just in the package the tests start from.

```bash
# Link entry points to compiled output
# Make sure to run `yarn build` beforehand
yarn link-entries dist

# Link entry points to source code
# Run when working on more packages at once or
# to calculate cross-package test coverage
yarn link-entries src
```

> Note: The versioned packages point to `dist`, because it's how they are published to npm. Having code parity between git and npm also makes it easier to work with Lerna, which [doesn't like publishing uncommitted changes from working tree](https://github.com/lerna/lerna/issues/1581). The release script takes care of pointing packages to _dist_. **Don't commit entry points linked to `src`!**

To understand `link-entries` better, see how it's used in the context of the [release](https://github.com/react-cosmos/react-cosmos/blob/7f860e355bd25f03c1af496b2e31c071ec15e8a1/package.json#L27) and [CI](https://github.com/react-cosmos/react-cosmos/blob/7f860e355bd25f03c1af496b2e31c071ec15e8a1/.travis.yml#L11-L21) flows.

#### Flow

The Cosmos monorepo is typed using [Flow](https://github.com/facebook/flow). Most types, especially ones reused, are found in the [react-cosmos-flow](https://github.com/react-cosmos/react-cosmos/tree/e5ed43681969890d5d29bb32bdaab3630cce9ca5/packages/react-cosmos-flow) package. This package is useful in two ways:

- Cosmos packages can easily share types and import them using convenient `react-cosmos-flow/*` paths

  ```js
  import type { Config } from 'react-cosmos-flow/config';
  ```

- 3rd party projects can also benefit from Cosmos types by adding `react-cosmos-flow` to their dev dependencies. Useful when writing a [custom proxy](#proxy-boilerplate).

> Cosmos packages mustn't add `react-cosmos-flow` to their `dependencies`, because Flow annotations shouldn't be published along with the compiled output. Let us know if you ever find unwanted Flow types in your node_modules because of Cosmos deps!

### Playground ⇆ Loader communication

The Cosmos UI is made out of two frames. Components are loaded inside an `iframe` for full encapsulation. Because the Playground and the Loader aren't part of the same frame, we use `postMessage` to communicate back and forth.

Read about all event payloads and their order [here](docs/playground-loader.md).

### webpack

The `react-cosmos` CLI extends the user's webpack config or fallbacks to a default config, which automatically detects and includes the user's Babel and CSS loaders.

The entry file of the resulting webpack config mounts `Loader` via `loaderConnect`, together with all the user components, fixtures and proxies. **The component and fixture paths are injected statically in the Loader bundle** via [embed-modules-webpack-loader.js](packages/react-cosmos/src/server/embed-modules-webpack-loader.js).

Using webpack-dev-middleware, the webpack config is attached to an Express server, which serves the Playground bundle at `/index.html` and the Loader bundle at `/_loader.html`. The server will also serve a static directory when the `publicPath` option is used.

Static exporting is almost identical to development mode, except that it saves the webpack build to disk instead of attaching it to a running Express server.

## Proxy boilerplate

Start from this when creating a new proxy.

```js
import React from 'react';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

const defaults = {
  // Add option defaults here...
};

export default () => {
  const {
    /* Expand options here... */
  } = { ...defaults, ...options };

  const NoopProxy = (props: ProxyProps) => {
    const { nextProxy, ...rest } = props;
    const { value: NextProxy, next } = nextProxy;

    return <NextProxy {...rest} nextProxy={next()} />;
  };

  return NoopProxy;
};
```

Notice the core requirements of a proxy:

- Renders next proxy with same props
- Advances the proxy chain – sends `props.nextProxy.next()` to next proxy
- Implements or extends default proxy PropTypes

This is a very basic example. Here's what proxies might also do:

- Implement lifecycle methods (mock stuff in constructor, revert it in componentWillUnmount)
- Add extra DOM markup around NextProxy
- Transform props of props.fixture (careful, tho.)

### Testing proxies

Writing tests for a new proxy often takes more than its implementation. Extend this [proxy test boilerplate](docs/proxy-test-boilerplate.md) and most of the pain will go away.

## How to contribute

A great way to start is by picking up a [`free for all`](https://github.com/react-cosmos/react-cosmos/issues?q=is%3Aopen+is%3Aissue+label%3A%22free+for+all%22) issue.

#### Be kind and thoughtful

We are doing this for free, so be realistic and don't expect special treatment. The better we communicate the more likely we'll end up collaborating.

#### Ask for review

Code review aside, also ask for review _before_ implementing solution. Saves everybody time and effort.

#### Get familiar with codebase

> Developing on Cosmos requires [Node](https://nodejs.org/en/download/) v6 or newer

Make sure you have [Yarn](https://yarnpkg.com/) installed. We use it to install dependencies faster and more reliably.

```bash
git clone git@github.com:react-cosmos/react-cosmos.git
cd react-cosmos

# Install deps and link child packages (using Lerna)
yarn

# Build monorepo packages
yarn build

# Build example from source and test React Cosmos end to end
cd examples/context
yarn start

# Load Playground source inside compiled Playground #inception
yarn start:playground

# Watch & build single package (running example will live reload)
yarn build react-cosmos-playground --watch

# Watch & run unit tests as you code
yarn test:watch
```

#### Write tests, preferably before implementation

Use [Jest](https://facebook.github.io/jest/) for unit testing. Look inside `__tests__` folders for examples.

#### Keep coding style consistent

Make sure `yarn run lint` passes and add [ESLint](https://eslint.org/docs/user-guide/integrations#editors) to your editor if possible.

When naming a file:

- Use _CamelCase_ for components: `DragHandle.js` or `DragHandle/index.js`
- Use _kebab-case_ for any other path: `packages/react-cosmos-shared/src/resolve-user-path.js`

When creating a module:

- **Named exports** are preferred over default exports
- **Function declarations** are preferred over arrow functions at the module level (one reason is that the order doesn't matter when using the former)

Please follow these rules or challenge them if you think it's worth it.

#### Use Git conscientiously

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://conventionalcommits.org/) (important for generating release notes)

---

_Have a question or idea to share? See you on [Slack](https://join-react-cosmos.now.sh/)._
