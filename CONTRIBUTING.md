## Mission

**How to design components that are truly encapsulated?**

[Read more.](https://github.com/skidding/react-cosmos/wiki/Problem)

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

These set of principles were defined before any code was written and have guided the evolution of the Cosmos project to present.

## Packaging

React Cosmos is split into smaller repositories for modularity and ease of development. This contributing guide applies to all included packages.

- [React Component Tree](packages/react-component-tree) – Serialize and reproduce the state of an entire tree of React components
- [React Component Playground](packages/react-component-playground) – Minimal frame for loading and testing React components in isolation
- [React Querystring Router](packages/react-querystring-router) – Bare router for React components, using query string as props

The `react-cosmos` repo is the top layer, responsible for offering a minimum configuration Component Playground entry point.

## Design

[The Best Code is No Code At All.](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Start with this in mind before adding any new line of code.

1. When thinking of adding or changing something, make sure it is in line with the project [mission.](#mission)
2. Once the value added is clear, strive for the simplest, most obvious solution.

## Style

Unless explicitly overridden, all rules from the [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) apply. The [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) is also a good reference.

## Tests

Unit tests both keep the project sane and define its specs. Providing test coverage for every contribution is mandatory.

## Git flow

Make sure you're familiar with the [Github flow.](https://guides.github.com/introduction/flow/)

### Commits

Use the imperative mood to express verbs and add a hashtag with the corresponding issue number at the end of each commit message. The Github UI will generate links to the referenced issues.

> Adapt fixture mapping to new Component Playground format [#115](https://github.com/skidding/react-cosmos/issues/115)

### Review

Ask for review *before* writing the code. Saves everybody time and effort.
