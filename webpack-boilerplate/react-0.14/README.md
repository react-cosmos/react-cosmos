# ComponentPlayground boilerplate

A webpack boilerplate with:
- [@gaearon](https://github.com/gaearon)'s [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate)
- [react-component-playground](https://github.com/skidding/react-component-playground) setup

Run `npm install && npm run playground` and have some fun on [localhost:8989](http://localhost:8989)!

**Note: Hot reloading is not yet supported for Stateless Components and changes to them will only be reflected after full reloading. Contribute or follow progress [here.](https://github.com/gaearon/babel-plugin-react-transform/pull/34)**

## Installing

Integrating this boilerplate into your codebase should be fairly straightforward if you're familiar with webpack and the React ecosystem. However, it's a lengthy process with many small pieces that need to be put together. Here's a breakdown of all the required steps:

### Dependencies

You can see all dependencies inside [`package.json`](package.json), but here's some handy copy-paste commands:
```
npm install --save react@0.14 lodash
npm install --save-dev babel-core@5 babel-loader@5 babel-plugin-react-transform@1 cosmos-js@0.7 express react-transform-catch-errors@1 react-transform-hmr@1 redbox-react@1 webpack-dev-middleware webpack-hot-middleware webpack yargs

# Optional, used in this example
npm install --save-dev babel-eslint css-loader eslint eslint-plugin-react postcss-loader postcss-nested style-loader
```

### webpack config

#### Hot reloading

These options are set in [`webpack.config.dev.js`](webpack.config.dev.js) to be used for both your development and *playground* builds.

```js
entry: [
  'webpack-hot-middleware/client?reload=true',
//...
```
```js
plugins: [
  new webpack.HotModuleReplacementPlugin(),
//...
```

```js
module: {
  loaders: [{
    test: /\.jsx?$/,
    loader: 'babel',
    include: path.join(__dirname, 'src'),
    query: {
      plugins: ['react-transform'],
      extra: {
        'react-transform': {
          transforms: [{
            transform: 'react-transform-hmr',
            imports: ['react'],
            locals: ['module']
          }, {
            transform: 'react-transform-catch-errors',
            imports: ['react', 'redbox-react']
          }]
        }
      }
    }
  },
//...
```

It's more common to put your Babel config inside `.babelrc`. That works as well, but you'll need to set `NODE_ENV` to omit hot reloading in production environments.

#### ComponentPlayground

These options are set in [`webpack.config.playground.js`](webpack.config.playground.js).

ComponentPlayground uses a different entry point and needs two aliases to be able to collect your components and fixtures. You can extend your development config for the rest.

```js
entry: [
  'webpack-hot-middleware/client',
  './playground/index'
],
```

```js
resolve: {
  alias: {
    COSMOS_COMPONENTS: path.join(__dirname, 'src/components'),
    COSMOS_FIXTURES: path.join(__dirname, 'fixtures')
  }
}
```

Adjust the paths these aliases point to based on the folders in your codebase.

### Playground files

Other files you need to copy in your codebase:

1. [`playground/index.js`](playground/index.js)
2. [`playground/get-component-fixture-tree.js`](playground/get-component-fixture-tree.js)

`index.js` allows you to setup any global environment that your components depend on. Just keep in mind your components are meant to be encapsulated.

You need to adjust `get-component-fixture-tree.js` in order to make this setup
work for a different nesting structure. This is the file structure expected by default:
```
|
+-- components
|   +-- FooComponent.jsx
|   +-- namespace
|   |   +-- BarComponent.jsx
+-- fixtures
|   +-- FooComponent
|   |   +-- default.js
|   |   +-- active.js
|   +-- namespace
|   |   +-- BarComponent
|   |       +-- default.js
|   |       +-- paused.js
```

### Dev server

[`devServer.js`](devServer.js) is slightly modified to run both development and playground builds, on ports `3000` and `8989` respectively.

### npm scripts

Useful shortcuts for firing up development.

```json
"scripts": {
  "start": "node devServer.js",
  "playground": "node devServer.js --env playground"
}
```

### index.html

Finally, make sure the JS bundle path from [`index.html`](index.html) matches the `output` section from your webpack config.
