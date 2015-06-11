## Mission

**How to design components that are truly encapsulated?**

[Read more.](https://github.com/skidding/cosmos/wiki/Problem)

## Manifesto

_cos·mos<sup>1</sup> `/ˈkäzməs,-ˌmōs,-ˌmäs/` noun — 1. The universe seen as
a well-ordered whole._

- Zero bootstrap
- Can be plugged into any other framework
- Everything is a Component
- Components are oblivious of ancestors
- Any component can be represented by a URI
- The state of the entire UI can be serialized at any given point in time
- Components can implement any data sync mechanism

These set of principles were defined before any code was written and have guided the evolution of Cosmos to present.

## Packaging

Cosmos is split into smaller repositories for modularity and ease of development. This contributing guide applies to all included packages.

- [ReactComponentTree](https://github.com/skidding/react-component-tree) – Serialize and reproduce the state of an entire tree of React components
- [ReactComponentPlayground](https://github.com/skidding/react-component-playground) – Minimal frame for loading and testing React components in isolation
- [ReactQuerystringRouter](https://github.com/skidding/react-querystring-router) – Bare router for React components, using query string as props

The `cosmos-js` package is the top layer, responsible for offering a minimum configuration ComponentPlayground setup for projects powered by React components.

## Design

[The Best Code is No Code At All.](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Start with this in mind before adding any new line of code.

1. When thinking of adding or changing something, make sure it is in line with the project [mission.](#mission)
2. Once the value added is clear, strive for the simplest, most obvious solution.

## Style

Unless explicitly overridden, all rules from the [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) apply. The [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) is also a good reference.

## Tests

Unit tests both keep the project sane and define its specs. Providing test coverage for every contribution is mandatory.

Repo | Build | Status
--- | --- | ---
[Cosmos](https://github.com/skidding/cosmos/tree/master/tests) | [![Build Status](https://travis-ci.org/skidding/cosmos.svg?branch=master)](https://travis-ci.org/skidding/cosmos) | [![Coverage Status](https://coveralls.io/repos/skidding/cosmos/badge.svg?branch=master)](https://coveralls.io/r/skidding/cosmos?branch=master)
[ReactComponentTree](https://github.com/skidding/react-component-tree/tree/master/tests) | [![Build Status](https://travis-ci.org/skidding/react-component-tree.svg?branch=master)](https://travis-ci.org/skidding/react-component-tree) | [![Coverage Status](https://coveralls.io/repos/skidding/react-component-tree/badge.svg?branch=master)](https://coveralls.io/r/skidding/react-component-tree?branch=master)
[ReactComponentPlayground](https://github.com/skidding/react-component-playground/tree/master/tests) | [![Build Status](https://travis-ci.org/skidding/react-component-playground.svg?branch=master)](https://travis-ci.org/skidding/react-component-playground) | [![Coverage Status](https://coveralls.io/repos/skidding/react-component-playground/badge.svg?branch=master)](https://coveralls.io/r/skidding/react-component-playground?branch=master)
[ReactQuerystringRouter](https://github.com/skidding/react-querystring-router/tree/master/tests) | [![Build Status](https://travis-ci.org/skidding/react-querystring-router.svg?branch=master)](https://travis-ci.org/skidding/react-querystring-router) | [![Coverage Status](https://coveralls.io/repos/skidding/react-querystring-router/badge.svg?branch=master)](https://coveralls.io/r/skidding/react-querystring-router?branch=master)

The only untested sections are the [webpack config](component-playground/config.js) and the [dev runner](bin/component-playground.js), which are also the parts most likely to change in the future.

## Git flow

Make sure you're familiar with the [Github flow.](https://guides.github.com/introduction/flow/)

### Branches

Prefix branch names with the corresponding issue number. E.g. `137-contributing-guide`

### Commits

Use the imperative mood to express verbs and add a hashtag with the corresponding issue number at the end of each commit message. The Github UI will generate links to the referenced issues.

> Adapt fixture mapping to new ComponentPlayground format [#115](https://github.com/skidding/cosmos/issues/115)

### Review

Ask for review *before* writing the code. Saves everybody time and effort.
