Cosmos
===
Data exploration framework

Built on top of the great [**React**](http://facebook.github.io/react/),
emphasizing on seamless data exploration through drill down actions,
implementing a uniform Component* model.

**Cosmos is to data visualization what
[Backbone](https://github.com/jashkenas/backbone) is to data modeling.**

\* The **Component** is a self-contained, UI building block.
See [React Component.](http://facebook.github.io/react/docs/component-api.html)

## Manifesto

_cos·mos<sup>1</sup> `/ˈkäzməs,-ˌmōs,-ˌmäs/` noun — 1. The universe seen as
a well-ordered whole._

- Zero bootstrap
- Can be plugged into any other framework
- Everything is a Component
- Components are oblivious of ancestors
- The state of a Component can be serialized at any given point in time
- Any Component configuration can be represented by a URI
- Components can implement any data mechanism*

\* All Cosmos core mixins are agnostic on how data is populated inside a
Component (see default [DataFetch](mixins/data-fetch.js) Ajax implementation.)

## Install

Cosmos is a versatile framework and can be installed in more than one way.

### Existing framework

Include `build/cosmos.js` if you already have the
[external dependencies](https://github.com/skidding/cosmos/blob/master/package.json#L8)
included in your project or `build/cosmos-with-dependencies.js` to include
them as well.

### Node module

```bash
npm install cosmos-js
```

You can require cosmos.js as a Node module, using a client-side package manager
like [browserify.](http://browserify.org/)

```js
var Cosmos = require('cosmos-js');
```

### Development

```bash
git clone https://github.com/skidding/cosmos.git && cd cosmos
npm install
./node_modules/.bin/gulp
```

Pop up `index.html` in your browser of choice to load the app skeleton from the
repo.

#### Running tests

Behavior tests are written for [Jasmine](https://github.com/pivotal/jasmine)
and ran with [jasmine-node](https://github.com/mhevery/jasmine-node) in a
DOM-less environment.

```bash
./node_modules/.bin/jasmine-node --verbose specs
```

## Specs

You should read the
[React docs](http://facebook.github.io/react/docs/getting-started.html) before,
Cosmos is merely a standarization on top of React's Component model. You need
to grasp the [Component **props**](http://facebook.github.io/react/docs/tutorial.html#using-props)
and [reactive **state**](http://facebook.github.io/react/docs/tutorial.html#reactive-state)
concepts before diving into Cosmos.

Since one of the Cosmos mantras is _The state of a Component can be serialized
at any given point in time_ (see [Manifesto](#manifesto)), __any Component in
any state can be represented and reproduced by a persistent JSON.__ This goes
hand in hand with React's **declarative** nature. The input data of a Component
is a JSON object. This input configuration is picked up by the Component,
interpreted based on what that Component implements, and exported into an
__HTML output.__ Easy to follow and assert behavior.

```js
// This could be the configuraton for a Component that renders a list of users
{
  "component": "List",
  "class": "users",
  "dataUrl": "users.json"
}
```

It's up a Component (or the mixins it uses) to implement any _prop_ received
from its input configuration, except for one reserved by convention:

- **component** - The name of the Component to load. Normally we should already
                  have a Component class when instantiating it, but there are
                  two main cases when this prop is relevant:
  - 1. When loading the Root Component*
  - 2. When a List Component receives a list of children to load

\* The **Root Component** is the first Component loaded inside a page, usually
pulling its input configuration from the URL query string.

### Mixins

__The behavior of a Component is determined by its
[Mixins.](http://facebook.github.io/react/docs/reusable-components.html#mixins)__
Each mixin can support a set of input _props,_ make new methods
available and interfere with the [lifecycle methods](http://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)
of a Component. While mixins can optionally profit from other mixins when
combined, they are independent by nature and should have an isolated assertable
behavior.

#### DataFetch Mixin

Bare functionality for fetching server-side JSON data inside a Component. Uses
basic Ajax requests and setInterval for polling.

```js
{
  "component": "List",
  "dataUrl": "/api/users.json",
  // Refresh users every 5 seconds
  "pollInterval": 5000
}
```

Props:

- **dataUrl** - A URL to fetch data from. Once data is received it will be set
                inside the Component's _state_, under the `data` key, and will
                cause a reactive re-render.
- **pollInterval** - An interval in milliseconds for polling the data URL.
                     Defaults to 0, which means no polling.

Context properties:

- **initialData** - The initial value of `state.data`, before receiving and
                    data from the server (see _data_ prop.) Defaults to an
                    empty object `{}`

#### PersistState Mixin

Heart of the Cosmos framework. Enables dumping a state object into a Component
and exporting the current state.

```js
{
  "component": "Item",
  "state": {"name": "John Doe", "age": "24"}
}
```

Props:

- **state** - An object that will be poured inside the initial Component
              _state_ as soon as it loads (replacing any default state.)

Methods:

- **generateSnapshot** - Generate a snapshot of the Component _props_
                         (including current _state_.) It excludes internal
                         props set by React during run-time and props with
                         [default values.](http://facebook.github.io/react/docs/component-specs.html#getdefaultprops)

#### Url Mixin

Enables basic linking between Components, with optional use of the minimal
built-in Router.

```js
React.createComponent({
  mixins: [Cosmos.mixins.PersistState,
           Cosmos.mixins.Url],
  render: function() {
    return React.DOM.a({
      href: this.getUrlFromProps(this.generateSnapshot()),
      onClick: this.routeLink
    }, "Maximize");
  }
});
```

Methods:

  - **getUrlFromProps** - Serializes a props object into a browser-complient
                          URL. The URL generated can be simply put inside the
                          _href_ attribute of an `<a>` tag, and can be combined
                          with the generateSnapshot method of the PersistState
                          mixin to create a link that opens the current
                          Component at root level (full window.)
  - **routeLink** - Any `<a>` tag can have this method bound to its onClick
                    event to have their corresponding _href_ location picked up
                    by the built-in Router implementation, which uses
                    _pushState_ to switch between Components instead of
                    reloading pages.
