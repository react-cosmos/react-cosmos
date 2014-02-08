fresh.js
===
Data exploration framework

## Manifesto

- Zero bootstrap
- Can be plugged into any other framework
- Everything is a widget
- Widgets are oblivious of ancestors
- The state of a widget can be serialized at any given point in time
- Any widget configuration can be represented by a URI
- Widgets can implement any data mechanism

## Install

fresh.js is a versatile framework and can be installed in more than one way.

### Existing framework

Include `fresh-bundle.js` if you already have the
[external dependencies](https://github.com/skidding/fresh/blob/master/package.json#L8)
included in your project or `fresh-bundle-with-dependencies.js` if to include
them as well.

```js
fresh.start(fresh.url.getParams(), document.body);
```

### Node module

```bash
npm install fresh-js
```

You can require fresh.js as a Node module, using a client-side package manager
like [browserify.](http://browserify.org/)

```js
var fresh = require('fresh-js');
```

### Development

```bash
git checkout https://github.com/skidding/fresh.git && cd fresh
npm install
./node_modules/.bin/gulp
```

