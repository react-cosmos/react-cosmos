Fresh
===
Data exploration framework

Built on top of the great [**React**](http://facebook.github.io/react/),
emphasizing on seamless data exploration through drill down actions,
implementing a uniform Component* model.

\* The **Component** is a self-contained, UI building block.
See [React Component.](http://facebook.github.io/react/docs/component-api.html)

## Manifesto

- Zero bootstrap
- Can be plugged into any other framework
- Everything is a Component
- Components are oblivious of ancestors
- The state of a Component can be serialized at any given point in time
- Any Component configuration can be represented by a URI
- Components can implement any data mechanism*

\* A custom data mechanism can be easily implemented for the
[DataManager interface](mixins/data-manager.js) (it defaults to Ajax requests.)
**Fresh is to data visualization what
[Backbone](https://github.com/jashkenas/backbone) is to data modeling.**

## Install

Fresh is a versatile framework and can be installed in more than one way.

### Existing framework

Include `build/fresh.js` if you already have the
[external dependencies](https://github.com/skidding/fresh/blob/master/package.json#L8)
included in your project or `build/fresh-with-dependencies.js` to include
them as well.

### Node module

```bash
npm install fresh-js
```

You can require fresh.js as a Node module, using a client-side package manager
like [browserify.](http://browserify.org/)

```js
var Fresh = require('fresh-js');
```

### Development

```bash
git clone https://github.com/skidding/fresh.git && cd fresh
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
Fresh is merely a standarization on top of React's Component model.

Since one of the Fresh mantras is _The state of a Component can be serialized
at any given point in time_ (see [Manifesto](#manifesto)), __any component in
any state can be represented and reproduced by a persistent JSON.__ This goes
hand in hand with React's **declarative** nature. The JSON configuration of a
Component is simply the [Component **props**](http://facebook.github.io/react/docs/tutorial.html#using-props)—the
__input data.__ This input configuration is picked up by the Component,
interpreted based on what that Component implements, and exported into an
__HTML output.__ Easy to follow and assert behavior.

```js
// This could be the configuraton for Component that renders a list of users
{
  "component": "List",
  "class": "users",
  "data": "/api/users.json"
}
```

__The behavior of a Component is determined by the
[Mixins](http://facebook.github.io/react/docs/reusable-components.html#mixins)
it implements.__ Each Mixin can support a set of input _props,_ make new
methods available and interfere with the [lifecycle methods](http://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)
of a component. While mixins can optionally profit from other mixins when
combined, they are independent by nature and should have an isolated assertable
behavior.

Before adding any Mixin to a Component class, it's up to that Component to
implement any _prop_ received from its configuration, except for one reserved
by convention:

- **component** - The name of the Component to load. Normally we should already
                  have a Component class when instantiating it, but there are
                  two main cases when this prop is relevant:
  - 1. When loading the Root Component*
  - 2. When a List Component receives a list of children to load

\* The **Root Component** is the first Component loaded inside a page, usually
pulling its configuration from the URL query string.
