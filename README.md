Cosmos [![Build Status](https://travis-ci.org/skidding/cosmos.svg)](https://travis-ci.org/skidding/cosmos)
===
A foundation for maintainable web applications.

Cosmos glues [React](http://facebook.github.io/react/) components together and
creates a uniform relationship between them.

There's no such thing as *controllers* or *pages* in Cosmos, just *components.*
The UI is a tree of components consisting of a root component and its
descendants. Any component can be loaded full-screen as the root element and
a route is just an alias to component _props._

Check out [**Flatris**](http://skidding.github.io/flatris/), a demo app built
with Cosmos.

Jump to:

- [Manifesto](#manifesto)
- [Installation](#installation)
- [Specs](#specs)
- [Problem](#problem)
- [Contributing](#contributing)

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

## Installation

Either install the `cosmos-js` [npm package](https://www.npmjs.org/package/cosmos-js)
or include the build directly in your project.

```html
<!-- Development build -->
<script src="http://skidding.github.io/cosmos/build/cosmos.js"></script>
<!-- Production build -->
<script src="http://skidding.github.io/cosmos/build/cosmos.min.js"></script>
```

## Specs

In Cosmos, any component in any state can be represented and reproduced by a
persistent JSON. This goes hand in hand with React's declarative nature.

The input data of a component is a JSON object and the role of a component is
to transform its input data into HTML output. Easy to follow and assert
behavior. See [React Component](http://facebook.github.io/react/docs/component-api.html)
for in-depth specs.

### Core concepts

Reserved props when working with Cosmos: `component`, `componentLookup` and
`state`.

#### Component lookup

In order to make component definitions serializable, Cosmos doesn't work with
classes directly. The `component` prop holds the name of the component, while
the `componentLookup` prop is used for passing a mapping function that returns
corresponding component classes.

Working with the component lookup also results in cleaner component files,
especially when using CommonJS modules with relative paths.

```js
var myComponent = Cosmos.render({
  component: 'my-component',
  componentLookup: function(name) {
    // The component classes can be drawn from any global namespace or require
    // mechanism
    return require('components/' + name + '.jsx');
  }
});
```

#### Component snapshot

The props and state of a component can be joined into a unified snapshot. The
`state` prop holds the state of the component.

```js
// Alter the state of the component
myComponent.setState({isDisabled: true});

// Serialize the state of a component into a JSON object
var componentSnapshot = myComponent.generateSnapshot());
```

This is what `componentSnapshot` would look like:

```js
{
  component: 'my-component',
  state: {
    isDisabled: true
  }
}
```

#### State injection

Serializing the state of component is no fun if we can't load it back later.

```js
// The clone will be created with the identical state of the original component
var clonedComponent = Cosmos.render(componentSnapshot);
```



### Mixins

Core mixins are placed under the `Cosmos.mixins` namespace. Read more in the
[Mixins wiki page.](https://github.com/skidding/cosmos/wiki/Mixins)

## Problem

Most web frameworks start out clean and friendly, but at some point after you
go on to build a real-life application on them they stop cooperating and start
turning against you. Finding an honorable route for solving a problem is now a
luxury, workarounds are the norm.

This can happen over and over. Slick at first, unmaintainable in 2 years. But
why is that, why is complexity proportional to the number of features added?

Two reasons:

1. **Interdependence.** Tie a number of units together, rely on one to change
the state of another and you successfully gave birth to
an unpredictable ecosystem
1. **Data obscurity.** Mixing data with logic turns any transparent river of
data into a muddy sewage network and generates a big
pile of opinionated, disposable code.

Avoiding these pitfalls upfront is difficult. They occur only after you've
reached a certain maturity in a program. Easy to notice once the code is no
longer pleasant to work with, but very hard to predict.

Cosmos fights against this uncertainty by surfacing the elements that don't
benefit from a natural tendency to scale.

### Vertical encapsulation

Working with so many entities builds complex relationships. Models,
Controllers, Views, Helpers, etc., they're all connected to each other in
various ways. Your application is the outcome of all sorts of objects with
different roles and behaviors depending on one another.

Scaling you app linearly requires a flat infrastructure. **Responsibilities
should translate into domain logic instead of low-level roles (data
modeling, rendering, etc.)**

Cosmos only has one entity: The Component. They are autonomous, have end-to-end
capabilities and each can function as a complete application by itself,
excluding interdependence from the start. Because they can describe their
output without relying on any external logic, components are declarative and
predictable.

Isolating the source of a bug now has O(1) complexity.

### Transparent data structures

> Bad programmers worry about the code. Good programmers
> worry about data structures and their relationships.

Cosmos is partly inspired by a Linus Torvalds
[comment](http://lwn.net/Articles/193245/) about **designing your code
around your data and not the other way around.**

But Cosmos does not impose any specific data structures, it simply makes them
surface and hard to miss. All component logic wraps around a single JSON
object, which starts as the component input and updates along with state
changes. That object will always be a visible, persistent data structure.

## Contributing

Until the Cosmos project becomes more solid and concrete, I urge you to recall
a past experience of building a web application that became harder and harder
to work on as time passed and development progressed. Attempt to answer this
question: If you enforced the Cosmos principles onto the infrastructure you're
picturing, would it: a) improve, b) complicate or c) not influence the
situation?

Thank you for your interest!
