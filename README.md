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

You should really read the
[React](http://facebook.github.io/react/docs/getting-started.html) docs before,
Fresh is merely a standarization on top of React's Component model.

A Component configuration consists of the
[props](http://facebook.github.io/react/docs/tutorial.html#using-props) object
for that React Component. It's up to that Component to implement most
properties, besides a few special ones that are reserved by convention:

- **component** - The name of the Component to load. Usually we already have a
                  Component class when setting its properties, but there are
                  two main cases when this property is relevant:
  - 1. When loading the Root Component* using `Fresh.start`
  - 2. When a List Component receives a list of children to load

- **data** - A URL for fetching data for that Component. Once data is received
             it will be set inside the Component's
             [state](http://facebook.github.io/react/docs/tutorial.html#reactive-state),
             under the `data` key, and will cause a reactive re-render.

- **state** - An object that will be poured inside the initial Component
              state as soon as it loads (replacing any default state.)
              Stringifying this as a JSON object can **persist any Component
              state.** This also means that any possible state of every
              Component has a unique URL.

\* The **Root Component** is the first Component loaded inside a page, normally
pulling its configuration from the URL query string params.
