Fresh
===
Data exploration framework

Built on top of the great [React](http://facebook.github.io/react/),
emphasizing on seamless data exploration through drill down actions,
implementing a uniform Widget component model.

## Manifesto

- Zero bootstrap
- Can be plugged into any other framework
- Everything is a widget
- Widgets are oblivious of ancestors
- The state of a widget can be serialized at any given point in time
- Any widget configuration can be represented by a URI
- Widgets can implement any data mechanism

## Install

Fresh is a versatile framework and can be installed in more than one way.

#### Existing framework

Include `fresh-bundle.js` if you already have the
[external dependencies](https://github.com/skidding/fresh/blob/master/package.json#L8)
included in your project or `fresh-bundle-with-dependencies.js` to include
them as well.

#### Node module

```bash
npm install fresh-js
```

You can require fresh.js as a Node module, using a client-side package manager
like [browserify.](http://browserify.org/)

```js
var Fresh = require('fresh-js');
```

#### Development

```bash
git clone https://github.com/skidding/fresh.git && cd fresh
npm install
./node_modules/.bin/gulp
```

Pop up `index.html` in your browser of choice to load the app skeleton from the
repo.

## Specs

You should really read the
[React](http://facebook.github.io/react/docs/getting-started.html) docs before,
Fresh is merely a standarization on top of React's Component model.

A widget configuration consists of the _props_ object for that React component.
It's up to that widget to implement most properties, besides a few special ones
that are reserved by convention:

- **widget** - The name of the widget to load. Usually we already have a widget
               class when setting its properties, but there are two main cases
               when this property is relevant:
  - 1. When loading the root widget using `Fresh.start`
  - 2. When a List widget receives a list of children to load

- **data** - A URL for fetching data for that widget. Once data is received it
             will be set inside the widget's _state_, under the `data` key, and
             will cause a reactive re-render.

- **state** - An object that will be poured inside the initial widget _state_
              as soon as it loads (replacing any default state.) Stringifying
              this as a JSON object can **persist any widget state.** This also
              means the root widget can have a URI that includes a given state.

\* The **root widget** is the first widget loaded inside a page, normally
pulling its configuration from the URL query string params.
