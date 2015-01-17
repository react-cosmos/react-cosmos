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

One of the Cosmos [mantras](#manifesto) is "The state of a Component can be
serialized at any given point in time," therefore __any Component in any state
can be represented and reproduced by a persistent JSON.__ This goes hand in
hand with React's declarative nature.

The input data of a Component is a JSON object and the role of a Component is
to transform its input data into HTML output. Easy to follow and assert
behavior.

See [React Component](http://facebook.github.io/react/docs/component-api.html)
for in-depth specs and detailed API.

```js
// Registering Cosmos Components is as easy as referencing them in the
// components namespace
Cosmos.components.Intro = React.createClass({
  render: function() {
    return <p>My name is {this.props.name} and I am from {this.props.hometown}.</p>
  }
});
```

_[JSX](http://facebook.github.io/react/docs/jsx-in-depth.html) improves the
readability of React Components a lot, but unfortunately
[GFM](http://github.github.com/github-flavored-markdown/) doesn't support it
yet._

```js
// This is how you load and render Component input in Cosmos
Cosmos.render({
  component: 'Intro',
  name: 'Johnny',
  hometown: 'Minneapolis'
});
// Since we didn't specify a DOM container to render this component in, an HTML
// string will be returned instead
"<p>My name is Johnny and I am from Minneapolis.</p>"
```

#### Component input (props)

```js
{
  component: 'Intro',
  name: 'Johnny',
  hometown: 'Minneapolis'
}
```

It's up to a Component (or the mixins it uses) to implement any _props_ received
as input, except for one reserved by convention: **component**, the name of the
Component to load (from the Cosmos.components namespace.)

It's counter-intuitive to have the Component name embedded in its input data,
but this is part of the Component serialization concept. Think of the
Component input data as a database entry and it will start making sense.

### Top-level API

Cosmos can be used as the main router for a web app, but also just for
rendering parts of an existent application. Here are the main API methods that
should make you feel at home with Cosmos.

#### Cosmos(props)

The _Cosmos_ namespace itself is a function. It's how you instantiate a
Component from the Cosmos.components namespace.

```js
Cosmos({
  component: 'Intro',
  name: 'Johnny',
  hometown: 'Minneapolis'
});
// is the equivalent of
Cosmos.components.Intro({
  name: 'Johny',
  hometown: 'Minneapolis'
});
```

Here's how rendering a Component inside another one looks like in JSX syntax:

```html
<Cosmos component="Intro"
        name="Johnny"
        hometown="Minneapolis" />
```

#### Cosmos.render(props, container, callback)

Renders a React Component from the Cosmos namespace (_component_ prop is
required.) The _container_ and _callback_ params are optional.

#### Cosmos.start(options)

Entry point for a Cosmos Router-powered app. Uses the HTML5 history.pushState
API to cache Component snapshots and listen to state changes, rendering
previous Components in an instant when going back through history.

The options are as follows:

- **props** - Initial Component input, defaults to the URL query string
- **defaultProps** - Default Component input to load when the given  _props_
                     are empty. Useful when the initial Component input is
                     loaded from the URL and you need a default Component
                     input for the `/` home path
- **container** - DOM container to render Components in, defaults to
                  `document.body`

Here's how a standard URL for an app powered by the Cosmos Router would look
like:

```
http://localhost/?component=Intro&name=Johnny&hometown=Minneapolis
```

The [URL mixin](https://github.com/skidding/cosmos/wiki/Mixins#url) is used for
routing links using the Cosmos Router.

### Mixins

Core mixins are placed under the `Cosmos.mixins` namespace. Read more inside
the [Mixins wiki page.](https://github.com/skidding/cosmos/wiki/Mixins)

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
