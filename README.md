Cosmos
===
Data exploration framework

Cosmos emphasizes on **data-driven navigation, full-screen visualizations and
seamless routing**, powered by an effective state-caching time machine.

Built on top of the great [**React**](http://facebook.github.io/react/),
implementing a **uniform Component model.** The Component is a self-contained,
UI building block. See [React Component.](http://facebook.github.io/react/docs/component-api.html)

> Cosmos is to data visualization what Backbone is to data modeling.

## Manifesto

_cos·mos<sup>1</sup> `/ˈkäzməs,-ˌmōs,-ˌmäs/` noun — 1. The universe seen as
a well-ordered whole._

- Zero bootstrap
- Can be plugged into any other framework
- Everything is a Component
- Components are oblivious of ancestors
- The state of a Component can be serialized at any given point in time
- Any Component input can be represented by a URI
- Components can implement any data mechanism*

\* All Cosmos core mixins are agnostic on how data is populated inside a
Component (see default [DataFetch](mixins/data-fetch.js) Ajax implementation.)

## Installation

Include either the development or the production build in your project.

```html
<script src="http://skidding.github.io/cosmos/build/cosmos.js"></script>
<script src="http://skidding.github.io/cosmos/build/cosmos.min.js"></script>
```

Cosmos only depends on `React ~0.9.0` and `Underscore.js ~1.5.2`

### Development

The demo skeleton is present in all branches and can be opened in any browser,
without any web server, simply check doing a git checkout of the repository and
generating a build using [gulp.](https://github.com/gulpjs/gulp)

```bash
git clone https://github.com/skidding/cosmos.git && cd cosmos
npm install
node_modules/.bin/gulp
```

## Specs

_Disclaimer: Cosmos sits on top of React's Component model and you should grasp
the [Component **props**](http://facebook.github.io/react/docs/tutorial.html#using-props)
and [reactive **state**](http://facebook.github.io/react/docs/tutorial.html#reactive-state)
concepts before diving in._

One of the Cosmos [mantras](#manifesto) is "The state of a Component can be
serialized at any given point in time," therefore __any Component in any state
can be represented and reproduced by a persistent JSON.__ This goes hand in
hand with React's declarative nature. The input data of a Component is a JSON
object and the role of a Component is to transform its input data into HTML
output. Easy to follow and assert behavior.

```js
// This could be the configuraton for a Component that renders a list of users
{
  "component": "List",
  "class": "users",
  "dataUrl": "users.json"
}
```

#### Component input (props)

It's up a Component (or the mixins it uses) to implement any _props_ received
as input, except for one reserved by convention:

- **component** - The name of the Component to load. Normally we should already
                  have a Component class when instantiating it, but there are
                  two main cases when this prop is relevant:
  - 1. When loading the Root Component*
  - 2. When a List Component receives a list of children to load

\* The **Root Component** is the first Component loaded inside a page, usually
pulling its input from the URL query string.

### Mixins

Mixins are meant to be responsible for all behavior that isn't specific to a
single Component.

Each mixin can support a set of input _props,_ make new methods
available and interfere with the [lifecycle methods](http://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)
of a Component. While mixins can optionally profit from other mixins when
combined, they are independent by nature and should follow the **Single
Responsibility Principle.**

Core mixins are be placed under the `Cosmos.mixins` namespace. Read more inside
the [Mixins wiki page.](https://github.com/skidding/cosmos/wiki/Mixins)
