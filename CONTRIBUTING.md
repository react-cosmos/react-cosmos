# Mission

**How to design components that are truly encapsulated?**

[Read more.](https://github.com/skidding/cosmos/wiki/Problem)

# Manifesto

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

# Packaging

Cosmos is split into smaller repositories for modularity and ease of development. This contributing guide applies to all included packages.

- [ReactComponentTree](https://github.com/skidding/react-component-tree) – Serialize and reproduce the state of an entire tree of React components
- [ReactComponentPlayground](https://github.com/skidding/react-component-playground) – Minimal frame for loading and testing React components in isolation
- [ReactQueryStringRouter](https://github.com/skidding/react-querystring-router) – Bare router for React components, using query string as props

The `cosmos-js` package is the top layer, responsible for offering a minimum configuration ComponentPlayground setup for projects powered by React components.

