<p align="center">
  <img alt="Cosmos" src="cosmos.png">
</p>

<p align="center">
  <strong>React Cosmos</strong> ✭ Dev tool for creating reusable <a href="http://facebook.github.io/react/">React</a> components
</p>

<p align="center">
  <a href="https://travis-ci.org/react-cosmos/react-cosmos">
    <img alt="Build status" src="https://travis-ci.org/react-cosmos/react-cosmos.svg?branch=master">
  </a>
  <a href="https://codecov.io/gh/react-cosmos/react-cosmos">
    <img alt="Codecov status" src="https://codecov.io/gh/react-cosmos/react-cosmos/branch/master/graph/badge.svg">
  </a>
  <a href="https://twitter.com/ReactCosmos">
    <img alt="Follow @ReactCosmos" src="https://img.shields.io/twitter/follow/ReactCosmos.svg?style=flat&label=Follow">
  </a>
  <a href="https://join-react-cosmos.now.sh/">
    <img alt="Slack" src="https://join-react-cosmos.now.sh/badge.svg">
  </a>
  <a href="https://spectrum.chat/cosmos">
    <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
  </a>
  <a href="CONTRIBUTING.md#how-to-contribute">
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
  </a>
</p>

> **New: [Cosmos 4.6 (React Native support and responsive display mode)](https://medium.com/@skidding/cosmos-4-6-a-minor-version-with-major-updates-27654de7f0c8)**

Cosmos scans your project for components and enables you to:

1.  Render components under any combination of props, context and state
2.  Mock _every_ external dependency (eg. API responses, localStorage, etc)
3.  See app state evolve in real-time while interacting with running instances

![Component Playground](intro.gif)

> Working with Cosmos improves component design because it surfaces dependencies. Cosmos forces us to define sane component inputs, making our UIs predictable and easier to debug down the road.

Read the story of React Cosmos: [Fighting for Component Independence](https://medium.com/@skidding/fighting-for-component-independence-2a762ee53272)

## Why Cosmos?

Many other component explorers emerged in the past years. [Storybook](https://github.com/storybooks/storybook) and [React Styleguidist](https://github.com/styleguidist/react-styleguidist) are good examples, but you can find an extensive list of options [here](https://react-styleguidist.js.org/docs/cookbook.html#are-there-any-other-projects-like-this). Check how much each tool matches your needs to decide which is best for you.

**Cosmos is a dev tool first, made to improve _all_ components, big and small, not just the stateless UI bits.** The [fixture](#fixtures) and [proxy](#proxies) architecture doubles as an [automated testing utility](#headless-testing), providing a complete solution for developing robust and reusable components. Cosmos also makes it easy to create a living style guide, but it's a secondary goal and you might get more value from alternatives if this is your chief concern.

## Usage

Requirements:

- [x] React >=0.14.9
- [x] webpack or Browserify (or roll your own integration)
- [ ] [Fixtures](#fixtures) (you'll create them after getting started)

React Cosmos works best with webpack. Making it work with other bundlers takes extra work, but a complete [Browserify example](examples/browserify) is available.

Jump to:

- **[Getting started](#getting-started)**
- [Fixtures](#fixtures)
  - [What's a fixture?](#whats-a-fixture)
  - [Where to put fixtures?](#where-to-put-fixtures)
  - [Props](#props)
  - [Children](#children)
  - [State](#state)
  - [Wrapper component](#wrapper-component)
  - [Init hook](#init-hook)
  - [Fixture name and namespace](#fixture-name-and-namespace)
- [Proxies](#proxies)
  - [What's a proxy?](#whats-a-proxy)
  - [Where to put proxies?](#where-to-put-proxies)
  - [Context](#context)
  - [Redux](#redux)
  - [React Router](#react-router)
  - [React Apollo (GraphQL)](#react-apollo-graphql)
  - [Fetch](#fetch)
  - [XHR](#xhr)
  - [LocalStorage](#localstorage)
  - [More proxies...](#more-proxies)
- [Integration with popular tools](#integration-with-popular-tools)
  - [Create React App](#create-react-app)
    - [With react-app-rewired](#with-react-app-rewired)
  - [Next.js](#nextjs)
  - [React Boilerplate](#react-boilerplate)
  - [React Redux Starter Kit](#react-redux-starter-kit)
- [Config](#config)
  - [Custom config path](#custom-config-path)
  - [Custom webpack config](#custom-webpack-config)
  - [Custom fixture paths](#custom-fixture-paths)
  - [Option dump](#option-dump)
- [Exporting](#exporting)
- [Headless testing](#headless-testing)
  - [Using Enzyme](#using-enzyme)
  - [Using a custom renderer](#using-a-custom-renderer)
  - [Capturing state changes](#capturing-state-changes)
  - [Updating fixtures in tests](#updating-fixtures-in-tests)
  - [createTestContext API](#createtestcontext-api)
  - [Global Jest snapshot](#global-jest-snapshot)
- [Beta: React Native](#beta-react-native)
- [Flow integration](#flow-integration)

_Have a question or idea to share? See you on [Slack](https://join-react-cosmos.now.sh/)._

### Getting started

Install via npm

```bash
npm install --save-dev react-cosmos
```

or Yarn

```bash
yarn add --dev react-cosmos
```

Add package.json scripts

```diff
"scripts": {
+  "cosmos": "cosmos"
+  "cosmos:export": "cosmos-export"
}
```

Run `npm run cosmos` or `yarn cosmos` and go to [localhost:8989](http://localhost:8989) 🎉

> If you rely on the default webpack config, make sure to install the Babel and webpack plugins yourself. Depending on your needs, you'll probably want `babel-preset-env babel-preset-react babel-loader style-loader css-loader html-webpack-plugin`. Finally, add `.babelrc` to your project root.
>
> ```
> {
>   "presets": ["env", "react"]
> }
> ```

#### Next steps

If everything's working

- **Create your first [fixture](#fixtures)**
- Configure or create [proxies](#proxies) (e.g. Redux integration)

If something's wrong

- Extend existing [webpack config](#custom-webpack-config)
- See [popular integrations](#integration-with-popular-tools) (e.g. CRA or Next.js)
- Extend your [config](#config)
- Be kind and [report what went wrong](https://github.com/react-cosmos/react-cosmos/issues)

### Fixtures

> **Old fixtures need to be adjusted to work with Cosmos v3**. Check out this [guide for upgrading](docs/fixture-upgrade.md).

#### What's a fixture?

A fixture is a JS object used to mock component input and external dependencies. The input can be [props](#props), [children](#children), [state](#state) and [context](#context). With the help of [proxies](#proxies), fixtures can mock anything else a component depends on, from API responses to localStorage.

```js
import Input from './Input';

export default {
  component: Input,
  props: {
    value: 'Lorem ipsum',
    disabled: true,
    onChange: value => console.log(`Select: ${value}`)
  }
};
```

> Check out this [quick hack](docs/fixtures.md) for getting started with fixtures.

#### Where to put fixtures?

Cosmos looks for `*.fixture.js` named files and files inside `__fixtures__` dirs by default. See [custom fixture paths](#custom-fixture-paths) for further customization.

It is also possible to export an array of fixtures from a single file. You may want to define the [fixture name and namespace](#fixture-name-and-namespace) in this case.

```js
export default [
  {
    component: Input,
    name: 'disabled',
    props: {
      disabled: true
    }
  },
  {
    component: Input,
    name: 'enabled',
    props: {
      disabled: false
    }
  }
];
```

#### Props

Mocking props is the most basic thing a fixture can do.

```js
export default {
  component: Auth,
  props: {
    loggedIn: true,
    user: {
      name: 'Dan the Man'
    }
  }
};
```

#### Children

Composition is the name of the game and many React components expect [children](https://facebook.github.io/react/docs/jsx-in-depth.html#children-in-jsx). You can specify your children just like you would any other prop:

```jsx
// React needs to be in scope for JSX to work
import React from 'react';

export default {
  component: Text,
  props: {
    someProp: true,
    children: (
      <div>
        <p>Fixture ain't afraid of JSX</p>
        <p>Fixture ain't afraid of nothin!</p>
      </div>
    )
  }
};
```

#### State

Mocking state is where things get interesting. [Component state](https://facebook.github.io/react/docs/react-component.html#state) is private IRL, but Cosmos allows us to inject it and simulate all the various states a component can find itself in.

```js
export default {
  component: SearchBox,
  state: {
    searchQuery: 'Who let the dogs out?'
  }
};
```

#### Wrapper component

You may identify a component directly, or provide a function. This allows for quick wrapping of components. If you find yourself doing this often with the same component, it might be time to try [proxies](#proxies).

```js
export default {
  component: props => (
    <Well>
      <SearchBox {...props, placeholder={'What are you looking for?'}} />
    </Well>
  ),
  props: {
    value: 'apples'
  }
};
```

#### Init hook

This is an advanced feature and should only be used when a desired state can't be reproduced via [proxies](#proxies).

```js
export default {
  component: Dashboard,
  async init({ compRef }) {
    // With great power comes great ref-sponsibility...
  }
};
```

#### Fixture name and namespace

The fixture name and namespace are detected automatically from the file name and file path respectively, but they can be overridden with custom values.

```js
export default {
  component: SearchBox,
  name: 'dog search',
  namespace: 'dashboard/pets'
};
```

### Proxies

#### What's a proxy?

Proxies are Cosmos plugins, allowing fixtures to go beyond mocking _props_ and _state_.

We've seen `component = f(props, state)` a hundred times–the seductive promise of React and libs alike. **In reality, however, it's more like `component = f(props, state, context)` and most components are _nothing_ without the context part.** This is still an oversimplification. The ugly truth is components take input from many other places: API responses, localStorage and window size to name a few.

But we know developing components in isolation is _The Way_, so intricate inputs won't stop us! With proxies, we look the devil in the eye and mock anything components depend on. Hell, we might even simplify our components once we're aware of all the crazy things they need to work.

How do proxies work? Well duh, they're _Just Components_. As regular React components, proxies compose in the order they are listed in your config and decorate the loaded component, respecting the contract to render the next proxy in the chain. They can be stateless or have a life cycle, mocking before mounting and unmocking before unmounting.

Proxies have two parts:

1.  **Configuration.** Done once per project, inside [cosmos.proxies.js](#where-to-put-proxies). Import proxy packages, call their default export (always a _create_ function) and add the result to the list of exported proxies. Some proxies require options, others work out of the box.
2.  **Activation**. Triggered by a special fixture attribute. Eg. The React Router proxy activates when `fixture.url` is defined, otherwise it's a noop. Proxies can also be always-active, but it's a best practice to make proxies opt-in to avoid useless overhead.

#### Where to put proxies?

As soon as you're ready to add proxies to your Cosmos setup, install them using your package manager. For example:

via npm

```bash
npm install --save-dev react-cosmos-fetch-proxy react-cosmos-redux-proxy react-cosmos-router-proxy
```

or Yarn

```bash
yarn add --dev react-cosmos-fetch-proxy react-cosmos-redux-proxy react-cosmos-router-proxy
```

Then create `cosmos.proxies.js` (in your project's root directory or next to cosmos.config.js) and export a list of proxies in the order they should load–from outermost to innermost.

> `cosmos.proxies.js` requires compilation so you may need to place it next to your source files (eg. if the `src` dir is whitelisted in babel-loader). Use `proxiesPath` option to customize its location.

Here's an example where we mock the Fetch API and add Redux and React Router providers:

```js
// cosmos.proxies.js
import createFetchProxy from 'react-cosmos-fetch-proxy';
import createReduxProxy from 'react-cosmos-redux-proxy';
import createRouterProxy from 'react-cosmos-router-proxy';
// We can import app files here
import configureStore from './configureStore';

// Read more about configuring Redux in the Redux proxy section below
const ReduxProxy = createReduxProxy({
  createStore: state => configureStore(state)
});

// We ensure a specific proxy order
export default [
  // Not all proxies have options, and often relying on defaults is good enough
  createFetchProxy(),
  ReduxProxy,
  createRouterProxy()
];
```

> For details on _creating_ proxies, see the [Proxy boilerplate](CONTRIBUTING.md#proxy-boilerplate)

Jump to:

- [Context](#context)
- [Redux](#redux)
- [React Router](#react-router)
- [React Apollo (GraphQL)](#react-apollo-graphql)
- [Fetch](#fetch)
- [XHR](#xhr)
- [LocalStorage](#localstorage)
- [More proxies...](#more-proxies)

#### Context

[React Context](https://facebook.github.io/react/docs/context.html): _With great power comes great responsibility._

> Note: React doesn't recommend using _context_ unless you're a lib, so in most cases we're better off using a higher level proxy like the [Redux](#redux) or [React Router](#react-router) one.

##### Configuration

```js
// cosmos.proxies.js
import createContextProxy from 'react-cosmos-context-proxy';
import PropTypes from 'prop-types';

const ContextProxy = createContextProxy({
  childContextTypes: {
    theme: PropTypes.object.isRequired
  }
});

export default [
  ContextProxy
  // ...other proxies
];
```

##### Activation

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  context: {
    theme: {
      backgroundColor: '#f1f1f1',
      color: '#222'
    }
  }
};
```

Check out the [context example](examples/context) to see the proxy in action.

#### Redux

Most components in a [Redux](http://redux.js.org/) app depend on Redux state, either they're a _container_ or one of their descendants is. This proxy creates a store using initial data from fixtures and puts it in the context, just like the [Provider](http://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store) does.

##### Configuration

```js
// cosmos.proxies.js
import createReduxProxy from 'react-cosmos-redux-proxy';
import configureStore from './configureStore';

const ReduxProxy = createReduxProxy({
  createStore: state => configureStore(state)
});

export default [
  ReduxProxy
  // ...other proxies
];
```

##### Activation

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  // An empty object will populate the store with the initial state
  // returned by reducers. But we can also put any state we want here.
  reduxState: {}
};
```

Writing Redux fixtures almost feels too easy. Because Redux state is global, once we have one state mock we can render any component we want!

#### React Router

> Warning: react-cosmos-router-proxy is designed for React Router **v4** and above

[React Router](https://reacttraining.com/react-router/) is used in most React projects. Wrapping components with `withRouter` makes the Router context an implicit dependency–one we need to mock.

##### Configuration

```js
// cosmos.proxies.js
import createRouterProxy from 'react-cosmos-router-proxy';

export default [
  createRouterProxy()
  // ...other proxies
];
```

##### Activation

Simply adding a `url` to your fixture will wrap the loaded component inside a [Router](https://reacttraining.com/react-router/core/api/Router).

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  url: '/about'
};
```

Optionally, `route` can be added to also wrap the loaded component inside a [Route](https://reacttraining.com/react-router/core/api/Route).

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  url: '/users/5',
  route: '/users/:userId'
};
```

If your component needs props from the `Route` component (history, location, and match), you can enable the `provideRouterProps` flag.

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  url: '/users/5',
  route: '/users/:userId',
  provideRouterProps: true
};
```

Check out the [React Router example](examples/react-router) to see the proxy in action.

#### React Apollo (GraphQL)

If you use the [React integration](http://dev.apollodata.com/react/) of [Apollo Client](http://dev.apollodata.com/) to provide data in your app, you may want to:

- Work on your data components in isolation
- Provide static or dynamic mocks to prototype your components

This proxy wraps your components with the `ApolloProvider` so they can render in Cosmos like they would normally in your app. Then, you'll be able to consume directly your API or mock its response.

##### Configuration

Provide:

- The GraphQL `endpoint` you send operations to
- Or The `client options object` used in your app

```js
// cosmos.proxies.js
import createApolloProxy from 'react-cosmos-apollo-proxy';

// option 1: specify a graphql endpoint

export default [
  createApolloProxy({
    endpoint: 'https://my.api.xyz/graphql'
  })
  // ...other proxies
];
```

```js
// cosmos.proxies.js
import createApolloProxy from 'react-cosmos-apollo-proxy';

// option 2: use the client from your app

import myConfiguredClientOptions from './src/client.js';

export default [
  createApolloProxy({
    clientOptions: myConfiguredClientOptions
  })
  // ...other proxies
];
```

##### "Live" behavior

Once configured, your components enhanced by `react-apollo` will behave as they would normally in your app, sending operation via your own client options object or to the endpoint passed specified in `cosmos.proxies.js`.

##### Mocking a response with a result or an error

Mocking at the fixture level is done by specifying an `apollo` key in your fixture.

The proxy will look for a `resolveWith` or a `failWith` key in order to return the appropriate mock value. This mocked return can be one of;

- an object
- a function returning an object
- a function that returns a Promise that either resolves or rejects with an object

See examples below or check [the fixtures defined in the Apollo example](examples/apollo/components/__fixtures__/Author).

##### Static response

```js
export default {
  component: Author,
  props: {
    authorId: 123
  },
  apollo: {
    resolveWith: {
      author: {
        __typename: 'Author',
        id: 123,
        firstName: 'Ovidiu'
      }
    }
  }
};
```

##### Dynamic response

```js
export default {
  component: Author,
  props: {
    authorId: 123
  },
  apollo: {
    resolveWith: ({ cache, variables, fixture }) => ({
      author: {
        __typename: 'Author',
        id: variables.authorId,
        firstName: variables.authorId === 123 ? 'Ovidiu' : 'Xavier'
      }
    })
  }
};
```

##### Promise response

```js
export default {
  component: Author,
  props: {
    authorId: 123
  },
  apollo: {
    resolveWith: ({ cache, variables, fixture }) =>
      Promise.resolve({
        author: {
          __typename: 'Author',
          id: variables.authorId,
          firstName: variables.authorId === 123 ? 'Ovidiu' : 'Xavier'
        }
      })
  }
};
```

##### Named responses

If your fixture's component is enhanced by multiple operations (like a query and a mutation), you can also provide the name of the operation so the proxy knows which response corresponds to which operation.

Below an example with a query & a mutation:

```js
export default {
  component: Author,

  props: {
    authorId: 123
  },
  apollo: {
    // mocked response for the query named PostsForAuthor
    PostsForAuthor: {
      resolveWith: {
        author: {
          __typename: 'Author',
          id: 123,
          firstName: 'Ovidiu',
          posts: [
            {
              __typename: 'Post',
              id: 456,
              title: 'Testing React Components',
              votes: 1234
            },
            {
              __typename: 'Post',
              id: 789,
              title: 'When to assert?',
              votes: 56
            }
          ]
        }
      }
    },
    // mocked response for the mutation named UpvotePost
    UpvotePost: {
      resolveWith: ({ cache, variables, fixture }) => {
        const data = cache.readQuery({
          query: QUERY,
          variables: { authorId: fixture.props.authorId }
        });

        const post = data.author.posts.find(
          post => post.id === variables.postId
        );

        return {
          upvotePost: {
            ...post,
            votes: post.votes + 10
          }
        };
      }
    }
  }
};
```

##### Failing response

You can use the `failWith` option to mock an apollo 'networkError', i.e. you did not get a successful response from the server (perhaps the internet connection is offline, or a 500 response was returned):

```js
export default {
  component: Author,
  props: {
    authorId: 123
  },
  apollo: {
    failWith: {
      message: 'Something went bad, please try again!'
    }
  }
};
```

To mock a valid response from an API which contains an errors object, you can use the following format:

```js
export default {
  component: Author,
  props: {
    authorId: -1
  },
  apollo: {
    resolveWith: {
      data: {
        author: null
      },
      errors: [
        {
          path: ['author'],
          message: ['Author id -1 not found'],
          locations: [{ line: 1, column: 0 }]
        }
      ]
    }
  }
};
```

Check out the [Apollo example](examples/apollo) to see `react-cosmos-apollo-proxy` in action! 🚀

#### Fetch

Besides client-side state, components also depend on external data. Mocking server responses allows us to completely isolate our components. This proxy makes mocking [Fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) responses a breeze.

##### Configuration

```js
// cosmos.proxies.js
import createFetchProxy from 'react-cosmos-fetch-proxy';

export default [
  createFetchProxy()
  // ...other proxies
];
```

##### Activation

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  fetch: [
    {
      matcher: '/users',
      response: [
        {
          id: 1,
          name: 'Prabu'
        },
        {
          id: 2,
          name: 'Karla'
        },
        {
          id: 3,
          name: 'Linbaba'
        }
      ]
    }
  ]
};
```

Built on top of [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/api). Check out the [Fetch example](examples/fetch) to see the proxy in action.

#### XHR

Like the [Fetch](#fetch) proxy, but for _XMLHttpRequest_.

##### Configuration

```js
// cosmos.proxies.js
import createXhrProxy from 'react-cosmos-xhr-proxy';

export default [
  createXhrProxy()
  // ...other proxies
];
```

##### Activation

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  xhr: [
    {
      url: '/users',
      response: (req, res) =>
        res.status(200).body([
          {
            id: 1,
            name: 'Blossom'
          },
          {
            id: 2,
            name: 'Bubbles'
          },
          {
            id: 3,
            name: 'Buttercup'
          }
        ])
    }
  ]
};
```

Built on top of [xhr-proxy](https://github.com/jameslnewell/xhr-mock). Check out the [Axios example](examples/axios) to see the proxy in action.

#### LocalStorage

Overrides the global localStorage API with a replica mock.

Mocking localStorage prevents conflicts with existing browser data and enables the localStorage API in test environments like Jest.

##### Configuration

```js
// cosmos.proxies.js
import createLocalStorageProxy from 'react-cosmos-localstorage-proxy';

export default [
  createLocalStorageProxy()
  // ...other proxies
];
```

##### Activation

```js
// __fixtures__/example.js
export default {
  component: MyComponent,
  localStorage: {
    userToken: 'foobar-token'
  }
};
```

#### More proxies

Other proxies created by the Cosmos community:

- [alp82/react-cosmos-glamorous-proxy](https://github.com/alp82/react-cosmos-glamorous-proxy) A simple proxy for react-cosmos to load glamorous themes
- [jozsi/react-cosmos-wrapper-proxy](https://github.com/jozsi/react-cosmos-wrapper-proxy) Easily wrap components using react-cosmos
- [concept-not-found/react-cosmos-reach-router-proxy](https://github.com/concept-not-found/react-cosmos-reach-router-proxy) A proxy for [@reach/router](https://github.com/reach/router)
- [react-intl-proxy](https://github.com/react-cosmos/react-cosmos/issues/636#issuecomment-377745222) A proxy for [yahoo/react-intl](https://github.com/yahoo/react-intl)
- [simeonc/react-cosmos-background-proxy](https://github.com/SimeonC/react-cosmos-background-proxy) A simple proxy for applying global styles and modifying the fixture background (via applying styles on the playground iFrame body)

_What proxy would you create to improve DX?_

### Integration with popular tools

#### Create React App

Add `react-cosmos` to dev dependencies and create `cosmos.config.js`.

```js
// cosmos.config.js
module.exports = {
  containerQuerySelector: '#root',
  webpackConfigPath: 'react-scripts/config/webpack.config.dev',
  publicPath: 'public',
  // Optional: Add this when you start using proxies
  proxiesPath: 'src/cosmos.proxies'
};
```

If you are using the `NODE_PATH` environment variable for absolute imports, make sure to include that as part of the cosmos script:

```js
// package.json
"scripts": {
  "cosmos": "NODE_PATH=./src cosmos"
}
```

Also make sure to:

- Put [proxies](#proxies) in the `src` dir–the only place included by the CRA Babel loader

_CRA + Cosmos example: [Flatris](https://github.com/skidding/flatris)_

##### With react-app-rewired

```diff
// cosmos.config.js
+const overrides = require('react-app-rewired/config-overrides');

module.exports = {
  containerQuerySelector: '#root',
  webpackConfigPath: 'react-scripts/config/webpack.config.dev',
+  webpack: config => overrides.webpack(config),
  publicPath: 'public',
  // Optional: Add this when you start using proxies
  proxiesPath: 'src/cosmos.proxies'
};
```

#### Next.js

Add `react-cosmos` to dev dependencies and create `cosmos.config.js`.

> Next.js apps run on both client & server, so compilation is done via Babel plugins instead of webpack loaders. This means we can rely on Cosmos' default webpack config.

```js
// cosmos.config.js
module.exports = {
  publicPath: 'static',
  publicUrl: '/static/'
};
```

Also make sure to:

- Add `html-webpack-plugin` to your dev dependencies
- Define `.babelrc` for the Cosmos webpack config to rely on the Next.js preset:

```json
{
  "presets": ["next/babel"]
}
```

_Next.js + Cosmos example: [Illustrated Algorithms](https://github.com/skidding/illustrated-algorithms)_

#### React Boilerplate

Add `react-cosmos` to dev dependencies and create `cosmos.config.js`.

```js
// cosmos.config.js
module.exports = {
  containerQuerySelector: '#app',
  webpackConfigPath: './internals/webpack/webpack.dev.babel',
  globalImports: ['./app/global-styles.js']
};
```

#### React Redux Starter Kit

Add `react-cosmos` to dev dependencies and create `cosmos.config.js`.

```js
// cosmos.config.js
module.exports = {
  webpackConfigPath: 'build/webpack.config.js'
};
```

Also make sure to:

- Set up the [Redux proxy](#react-cosmos-context-proxy) :)

### Config

The Cosmos config is optional, but it's very likely you'll want to create one at some point to set some custom options. The standard approach is to put a `cosmos.config.js` file in your project root.

#### Custom config path

Use the `--config` CLI arg if you prefer not placing the config in the project root.

```js
// package.json
"scripts": {
  "cosmos": "cosmos --config path/to/cosmos.config.js"
}
```

Set the `rootPath` option to match the project root when using a custom config path. All other paths defined in the config are relative to rootPath.

```js
// cosmos.config.js
module.exports = {
  rootPath: '../../'
};
```

#### Custom webpack config

The default webpack config included in Cosmos checks to see which packages you have installed and, if found, automatically includes the Babel, CSS and JSON loaders, as well as the HtmlWebpackPlugin.

If you already have a hairy webpack config that you'd like to reuse, set the `webpackConfigPath` option to your webpack config's file path and Cosmos will do its best to extend it.

You can also customize your webpack config specifically for Cosmos. Eg. Omitting one plugin from the Cosmos build.

```js
// cosmos.config.js
module.exports = {
  webpack: (config, { env }) => {
    // Return customized config
    return {
      ...config,
      plugins: config.plugins.filter(
        p => !p.constructor || p.constructor.name !== 'OfflinePlugin'
      )
    };
  }
};
```

#### Custom fixture paths

The `fileMatch`, `fileMatchIgnore` and `exclude` options are used to detect fixture files. The default `fileMatch` value is meant to accommodate most needs out of the box:

```
'**/__fixture?(s)__/**/*.{js,jsx,ts,tsx}',
'**/?(*.)fixture?(s).{js,jsx,ts,tsx}'
```

The default `fileMatchIgnore` value is meant to [ignore node_modules folder](docs/file-match-ignore.md):

```
'**/node_modules/**'
```

> Note: Set the `rootPath` to a dir parent to all fixture files when using a [custom config path](#custom-config-path)

TODO: Add `fixtureDir` and `fixtureSuffix` options for easier file match customization [#488](https://github.com/react-cosmos/react-cosmos/issues/488)

#### Option dump

Options supported by `cosmos.config.js`.

```js
// cosmos.config.js
module.exports = {
  // Set all other paths relative this this one. Important when cosmos.config
  // isn't placed in the project root
  rootPath: '../',

  // Additional entry points that should be present along with any component
  // Sad, but inevitable
  globalImports: ['./reset.css', './global.css'],

  // Customize pattern(s) for matching fixture files
  fileMatch: ['**/fixtures-in-here/**/*.js'],

  // Fixtures will not be loaded in the playground if their names match these
  exclude: [/not-a-fixture/, /its-complicated/, /its-not-me-its-you/],

  // File path to serve static files from. Like --content-base in webpack-dev-server
  publicPath: 'src/public',

  // Set base URL for both webpack assets and static files from publicPath
  // Maps to webpack.output.publicPath
  // https://webpack.js.org/configuration/output/#output-publicpath
  publicUrl: '/static/',

  // Customize proxies file path. Useful if Babel doesn't compile the root dir
  proxiesPath: 'src/proxies.cosmos',

  // Render inside custom root element. Useful if that root element already
  // has styles attached, but bad for encapsulation
  containerQuerySelector: '#app',

  // Disable hot module replacement
  hot: false,

  // HTTP proxy specific requests to a different target
  httpProxy: {
    context: '/api',
    target: 'http://localhost:4000/api'
  },

  // Reuse existing webpack config
  webpackConfigPath: './config/webpack.config.dev',

  // Customize webpack config
  webpack: (config, { env }) => {
    // Return customized config
    return config;
  },

  // Specify where should webpack watch for fixture files (defaults to rootPath)
  watchDirs: ['src'],

  // Customize dev server
  hostname: 'localhost',
  port: 8989
};
```

### Exporting

Static Component Playground? Piece of 🍰!

Add this script and run `npm run cosmos:export` or `yarn cosmos:export`.

```diff
"scripts": {
+  "cosmos:export": "cosmos-export"
}
```

Now you can deploy the `cosmos-export` directory to any static hosting service.

> Use [http-server](https://github.com/indexzero/http-server) or any static file server to load the export locally.

### Headless testing

> Add `react-cosmos-test` to your dev dependencies for this API.

Besides showing up in the Playground UI, fixtures can also be used independently to render a component in a mocked environment.

#### Using Enzyme

The test API exposes an entry point specifically designed for [Enzyme](http://airbnb.io/enzyme/).

```js
import createTestContext from 'react-cosmos-test/enzyme';
import fixture from './fixture';

const { mount, getWrapper } = createTestContext({ fixture });

beforeEach(mount);

test('renders hello', () => {
  expect(getWrapper().text()).toContain('Hello World');
});
```

> Enzyme v3 requires us to call `wrapper.update` after a component updates, usually in response to an event ([see thread](https://github.com/airbnb/enzyme/issues/1163)). The `react-cosmos-test/enzyme` wrapper tries to alleviate this by updating the wrapper whenever we call `getWrapper()`. If your components don't seem to be updating in tests this may be due to to assigning `getWrapper()` to a variable and expecting it to change.

But this is not the only way. As we'll see below, we can also mount fixtures using with a custom renderer.

#### Using a custom renderer

Here's how to render a fixture with good ol' [react-test-renderer](https://reactjs.org/docs/test-renderer.html).

```js
import { create as renderer } from 'react-test-renderer';
import createTestContext from 'react-cosmos-test/generic';
import fixture from './fixture';

const { mount, getWrapper } = createTestContext({
  renderer,
  fixture
});

beforeEach(mount);

test('matches snapshot', () => {
  // Careful, this is no longer an Enzyme wrapper, but a react-test-renderer wrapper!
  expect(getWrapper().toJSON()).toMatchSnapshot();
});
```

#### Capturing state changes

The fixture does more than just defining component input. Like a sticky fly trap, the fixture captures state changes that occur during the component's lifecycle, which we can then inspect. For example:

- If Redux state changes, the latest state can be read via `get('reduxState')`
- If Router URL changes, the latest URL can be read via `get('url')`

Instead of polluting our tests with various store and provider initialization, we let the [Proxies](#proxies) take care of it and then collect state changes from the updated fixture.

> The following example assumes `react-cosmos-router-proxy` is configured.

```js
import createTestContext from 'react-cosmos-test/enzyme';
import fixture from '../__fixtures__/logged-in';

const { mount, getWrapper, get } = createTestContext({ fixture });

beforeEach(mount);

test('redirects to home page after signing out', () => {
  getWrapper('.logout-btn').simulate('click');

  expect(get('url')).toBe('/');
});
```

#### Updating fixtures in tests

Sometimes we want to test that a component updates correctly in response to _prop_ changes. We can use `setProps` to pass new props to a component. `setProps` merges passed in props with existing props.

```js
import createTestContext from 'react-cosmos-test/enzyme';
import fixture from '../__fixtures__/button';

const { mount, getWrapper, setProps } = createTestContext({ fixture });

beforeEach(mount);

test('responds to props being updated', () => {
  expect(getWrapper('.btn').hasClass('warning')).toBeFalsy();
  setProps({ warning: true });
  expect(getWrapper('.btn').hasClass('warning')).toBeTruthy();
});
```

#### createTestContext API

The createTestContext API makes use of already configured proxies, which can be included in more ways.

```js
// Detect proxies automatically by reading cosmos config from cwd (or via --config CLI arg)
const { mount } = createTestContext({ fixture });

// Or point to a custom config path
const { mount } = createTestContext({
  fixture,
  cosmosConfigPath: '/path/to/my/special/config';
});

// Or pass proxies directly
const { mount } = createTestContext({ fixture, proxies });

// By default we auto apply jest.fn to all functions in fixture.props recursively.
// This makes it possible to do expect(fixture.props.*).toHaveBeenCalled in Jest
// without wrapping any callback with jest.fn() by hand.
// If this causes issues you can disable this feature, for example the case in https://github.com/react-cosmos/react-cosmos/issues/658
const { mount } = createTestContext({ fixture, autoMockProps: false });
```

##### Context methods

- _async_ `mount` Mounts component via renderer (usually called in `beforeEach`)
- `unmount` Calls unmount method of wrapper returned by renderer
- `getWrapper` Returns wrapper returned by renderer
- `getRef` Get component ref (exclusively for Class components)
- `getField(fixtureKey)` (or `get` for brevity) Returns updated fixture field
- `setProps(newProps)` _Merges_ passed in props with existing fixture props (triggers re-render)

#### Global Jest snapshot

You can create a snapshot of all your components with `react-cosmos-telescope`. A single snapshot file for all components isn't ideal, but it makes a difference until you have time to create granular tests.

```js
import runTests from 'react-cosmos-telescope';

runTests({
  cosmosConfigPath: require.resolve('./cosmos.config.js')
});
```

### Beta: React Native

> Follow these steps once you have `react-cosmos` installed.

Add package.json script

```diff
"scripts": {
+  "cosmos-native": "cosmos-native"
}
```

(Temporarily) Replace `App.js` (your app's entry point) with this:

```jsx
import React, { Component } from 'react';
import { CosmosNativeLoader } from 'react-cosmos-loader/native';
import { options, getUserModules } from './cosmos.modules';

export default class App extends Component {
  render() {
    return <CosmosNativeLoader options={options} modules={getUserModules()} />;
  }
}
```

Start your native app's dev server, and in another terminal run `npm run cosmos-native` or `yarn cosmos-native` and go to [localhost:8989](http://localhost:8989) 🔥

> Since \_\_\_fixtures\_\_\_ dirs are [blacklisted by default in RN](https://github.com/facebook/react-native/blob/9176fc00b59d1a384008f26d72ba57a2a08e0726/local-cli/util/Config.js#L55-L57), **you may need to override the `getBlacklistRE` setting.**

```js
// rn-cli.config.js
const blacklist = require('metro/src/blacklist');

module.exports = {
  getBlacklistRE() {
    // __fixtures__ are blacklisted by default
    return blacklist([]);
  }
};
```

Next steps:

- Add auto-generated file `cosmos.modules.js` to gitignore
- Split App.js into `App.cosmos.js` and `App.main.js` — Check out [the CRNA example](https://github.com/react-cosmos/react-cosmos/tree/master/examples/create-react-native-app) for inspiration
- [Report an issue](https://github.com/react-cosmos/react-cosmos/issues/new) or [share some feedback](https://join-react-cosmos.now.sh/)

### Flow integration

> Note: The `createFixture` helper only type checks _fixture.props_. It's not able to validate other fixture fields that map to custom proxies, but it still provides great value in many cases.

```js
import { createFixture } from 'react-cosmos';
import { Button } from '.';

export default createFixture({
  component: Button,
  props: {
    label: 'Press me',
    disabled: 'false'
    // Cannot call createFixture with object literal bound to fixture because
    // string [1] is incompatible with boolean [2] in property props.disabled.
  }
});
```

> Warning: Prop types are lost when using fixtures for components wrapped in higher order components.

## Join the component revolution!

This project welcomes all. Check out the [Contributing Guide](CONTRIBUTING.md) to read about the project's mission and how to get involved. Ask anything on [Slack](https://join-react-cosmos.now.sh/). Let's make UI development fun!

Thanks to [Kreativa Studio](http://www.kreativa-studio.com/) for the Cosmos logo.
