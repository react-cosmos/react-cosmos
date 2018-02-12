Hello, fellow human!

You seem to be interested in the inner workings of Cosmos. Good news, we've been expecting you. Before continuing, we kindly ask you to respect the terms of the [Contributor Code of Conduct](CODE_OF_CONDUCT.md). Thanks!

Jump to:

* [Mission](#mission)
* [Goals](#goals)
* [Roadmap](#roadmap)
* [Tracking](#tracking)
* [Architecture](#architecture)
  * [Monorepo](#monorepo)
  * [Playground & Loader](#playground--loader-communication)
  * [webpack](#webpack)
* [Proxy boilerplate](#proxy-boilerplate)
  * [Testing proxies](#testing-proxies)
* [How to contribute](#how-to-contribute)

## Mission

**To preserve harmony in UI projects by making component reusability simple & fun.**

Cosmos is built on the assumption that complexity in large apps stems from hidden links between parts. Tedious as it can be to uncover each and every component dependency, committing to it promises predictability and long term sanity.

## Goals

All contributions should be in line with these long term goals. Contributions that advance these goals have higher priority.

* [#PainlessOnboarding](https://github.com/react-cosmos/react-cosmos/labels/%23PainlessOnboarding) DX is king. Minimize initial config and integrate easily with popular tools and starter kits.

* [#MockEverything](https://github.com/react-cosmos/react-cosmos/labels/%23MockEverything) Every component input can and should be mocked. Redux state, Router context, API responses. No input left unmocked.

* [#UniversalComponentPlayground](https://github.com/react-cosmos/react-cosmos/labels/%23UniversalComponentPlayground) Abstract the core from the React loader and allow other rendering engines to plug into Cosmos.

## Roadmap

High impact initiatives. By working on these exciting topics, you have the opportunity to make a significant project contribution and radically advance the Cosmos mission.

> Warning: These are high-level tasks and they require further analysis and collaboration before they can be turned into concrete tasks

* ~~[Redesign filesystem API](https://github.com/react-cosmos/react-cosmos/issues/440)~~
* [Config generation](https://github.com/react-cosmos/react-cosmos/issues/452)
* [Create Cosmos server](https://github.com/react-cosmos/react-cosmos/pull/383#issuecomment-328297128)

## Tracking

[Projects](https://github.com/react-cosmos/react-cosmos/projects) are used to track large releases. [Issues](https://github.com/react-cosmos/react-cosmos/issues) are used for everything else.

#### Issue labels

* `hmm` Questions and support
* `oops` Bugs
* `i have a dream` Feature proposals

Drafts progress through the following phases:

* `needs love` Require feedback and a sound plan
* `free for all` Ready to be picked up by anyone
* _Assigned_

There's also a label for each [long term goal](#goals).

## Architecture

[The Best Code is No Code At All.](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Start with this in mind before writing code.

### Monorepo

React Cosmos is a [monorepo](packages) powered by [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna). The monorepo structure makes it possible to publish independent packages while being able to have end-to-end tests for the whole project, and to easily link examples to unpublished packages.

Important to note:

* **Test and build tools are installed globally in the root node_modules.** This includes Jest, Babel, webpack, and their corresponding plugins and loaders. ESLint is also applied globally. Creating a new package has less overhead because of this.

* **React and webpack deps are installed globally in the root node_modules.** The linked packages and examples are sibling directories, so they each have a separate node_modules dir. But, when Cosmos packages are installed in a user codebase, they all share a common node_modules. We simulate the real life scenario by deduplicate these dependencies.

Because of the latter, integration tests or examples for older React or webpack version are not possible inside the monorepo. We should create external repos for testing React 0.14.x or webpack 1.x.

#### Compiled vs source code

Monorepo packages have source code under `packages/PKG_NAME/src` and compiled code under `packages/PKG_NAME/lib`. Package entries point to the compiled code (ie. `lib/index.js`), so whenever we reference a specific file from another package we must also point to the lib path:

```js
import { moduleExists } from 'react-cosmos-shared/lib/server';
```

But, if we want to import a Flow type we'll only find it using the src path:

```js
import type { FixtureFile } from 'react-cosmos-voyager2/src/types';
```

Ideally we would always import the source of other packages for Flow to validate types across packages, but if we do this we end up running uncompiled code on the user's machine, which is not cool. Even when Node will support ES modules without a feature flag, we'll still want to compile stuff like Flow or JSX.

Please reach out of you have a better idea for handling this!

### Playground ⇆ Loader communication

The Cosmos UI is made out of two frames. Components are loaded inside an `iframe` for full encapsulation. Because the Playground and the Loader aren't part of the same frame, we use `postMessage` to communicate back and forth.

Read about all event payloads and their order [here](docs/playground-loader.md).

### webpack

The `react-cosmos` CLI extends the user's webpack config or fallbacks to a default config, which automatically detects and includes the user's Babel and CSS loaders.

The entry file of the resulting webpack config mounts `Loader` via `loaderConnect`, together with all the user components, fixtures and proxies. **The component and fixture paths are injected statically in the Loader bundle** via [module-loader.js](packages/react-cosmos/src/module-loader.js)—a custom webpack loader.

Using webpack-dev-middleware, the webpack config is attached to an Express server, which serves the Playground bundle at `/` and the Loader bundle at `/loader/`. The server will also serve a static directory when the `publicPath` option is used.

Static exporting is almost identical to development mode, except that it saves the webpack build to disk instead of attaching it to a running Express server.

## Proxy boilerplate

Start from this when creating a new proxy.

```js
import React from 'react';

import type { ProxyProps } from 'react-cosmos-shared/src/react/types';

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

* Renders next proxy with same props
* Advances the proxy chain – sends `props.nextProxy.next()` to next proxy
* Implements or extends default proxy PropTypes

This is a very basic example. Here's what proxies might also do:

* Implement lifecycle methods (mock stuff in constructor, revert it in componentWillUnmount)
* Add extra DOM markup around NextProxy
* Transform props of props.fixture (careful, tho.)

### Testing proxies

Writing tests for a new proxy often takes more than its implementation. Extend this [proxy test boilerplate](docs/proxy-test-boilerplate.md) and most of the pain will go away.

## How to contribute

A great way to start is by picking up a [`free for all`](https://github.com/react-cosmos/react-cosmos/issues?q=is%3Aopen+is%3Aissue+label%3A%22free+for+all%22) issue. Keep the project [goals](#goals) in mind.

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

Make sure `yarn run lint` passes and add [xo](https://github.com/sindresorhus/xo) to your editor if possible.

When naming a file:

* Use _CamelCase_ for components: `DragHandle.js` or `DragHandle/index.js`
* Use _kebab-case_ for any other path: `packages/react-cosmos-shared/src/resolve-user-path.js`

Please follow these rules or challenge them if you think it's worth it.

#### Use Git conscientiously

* [GitHub Flow](https://guides.github.com/introduction/flow/)
* [Conventional Commits](https://conventionalcommits.org/) (important for generating release notes)

---

_Have a question or idea to share? See you on [Slack](https://join-react-cosmos.now.sh/)._
