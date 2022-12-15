# React Cosmos and ES Modules

This document tracks the current status on ESM support in React Cosmos, which involves a number of parts with varying user impact and priority:

- [Publish packages as ESM, including server code.](#esm-packages)
- [Serve ESM fixtures and support bundlerless setups.](#esm-fixtures)
- [Support unbundled ESM UI plugins.](#esm-ui-plugins)
- [Serve Playground UI as ESM.](#esm-playground-ui)

## ESM packages

This is already done. No more Babel runtime. Installed React Cosmos packages are now easy to inspect and debug by anyone — they're essentially source code stripped of TypeScript annotations.

Converting the server runtime to ESM was the trickier part. We replaced `require` with ESM equivalents, while mocking parts of the new code with an old require-based implementation inside Jest (which [isn't quite ready](https://jestjs.io/docs/ecmascript-modules) for ESM yet).

The new codebase is nimble, future-proof and restricts React Cosmos to modern browsers and Node 16+.

## ESM fixtures

Loading pure ESM fixtures without a bundler is almost possible. Here's what's required:

- [x] Publish React Cosmos utils and renderer APIs as ESM.
- [ ] Embed fixture and decorator maps, and mount renderer in generated index.html (via `"module"` script).
- [ ] Serve user's source modules.
- [ ] **Tricky part:** Serve user's NPM dependencies and make them accessible through generated [import maps](https://github.com/WICG/import-maps) in the renderer index. This requires a smart static server for resolving and serving node_modules, which can be nested and/or come from a parent directory in monorepos. In static exports NPM dependencies have to be extracted and resolved from their new location.

The closer we get to ESM fixture support, however, the more unlikely it seems anyone would use it. Any real world front-end project needs to package its NPM dependencies at some point. Adding support for Vite (which Snowpack also deprecated itself in favor of) sounds like a more fruitful endeavour on the bundler front at the moment.

> Another tricky requirement for loading ESM fixtures in the browser is depending only on ESM 3rd party libraries. React for example isn't published as ESM. There's [es-react](https://github.com/lukejacksonn/es-react) but is hasn't been updated since React 16.

Here's a rough example of the renderer index.html for ESM fixtures.

```html
<body>
  <div id="root"></div>
  <script type="importmap">
    {
      "imports": {
        "lodash-es": "/node_modules/lodash-es/lodash.js",
        "react": "https://unpkg.com/es-react",
        "react-dom": "https://unpkg.com/es-react/react-dom",
        "react-is": "https://unpkg.com/es-react/react-is",
        "react-cosmos-core": "/node_modules/react-cosmos-core/dist/index.js",
        "react-cosmos-dom": "/node_modules/react-cosmos-dom/dist/index.js",
        "styled-components": "/node_modules/styled-components/dist/styled-components.esm.js"
      }
    }
  </script>
  <script type="module">
    import fixture0 from './src/__fixtures__/Controls.js';
    import fixture1 from './src/__fixtures__/HelloWorld.js';
    import fixture2 from './src/__fixtures__/Props.js';
    import decorator0 from './src/WelcomeMessage/cosmos.decorator.js';
    import { mountDomRenderer } from 'react-cosmos-dom';

    mountDomRenderer({
      rendererConfig: {},
      fixtures: {
        'src/__fixtures__/Controls.tsx': { module: { default: fixture0 } },
        'src/__fixtures__/HelloWorld.ts': { module: { default: fixture1 } },
        'src/__fixtures__/Props.tsx': { module: { default: fixture2 } },
      },
      decorators: {
        'src/WelcomeMessage/cosmos.decorator.tsx': decorator0,
      },
    });
  </script>
</body>
```

## ESM UI plugins

Authoring UI plugins as pure ESM is a cool prospect. It lowers the barries for plugin authors. It's also possible. ESM modules can be script-injected or dynamically imported from a CJS Playground. Here's what's needed to make this possible:

- Same as with ESM fixtures: Serve NPM dependencies from node_modules and make them accessible via import maps in the Playground index.html (eg. `styled-components` has 10 runtime dependencies that need mapping). Import maps for installed NPM modules should be automatically generated for this to work smoothly.
- Static exports need to employ a slightly different strategy where node_modules are also exported, with import maps pointing to their new location.

This is doable with some work. But for now, building UI plugins with shared dependencies attached to the global window namespace is a decent compromise (eg. using Webpack `externals`). Bundled plugins will be easy to re-publish as ESM later on once we add support.

## ESM Playground UI

Serving the Playground UI as ESM is mostly symbolic at this point. It doesn't help the user in any way and isn't required for supporting ESM UI plugins. In fact, serving the Playground UI and all its NPM dependencies as ESM will probably decrease run-time performance and complicate static exports. Still, we can track the progress here in case we ever decide to pursue this.

## Inspiration and further reading

- https://blog.logrocket.com/es-modules-in-node-today/
- https://nodejs.org/api/esm.html#differences-between-es-modules-and-commonjs
- https://nodejs.org/api/module.html#modulecreaterequirefilename
- https://nodejs.org/docs/latest-v15.x/api/esm.html#esm_loaders
- https://nodejs.org/docs/latest-v17.x/api/esm.html#importmetaresolvespecifier-parent
- https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-move-my-commonjs-project-to-esm
- https://github.com/sindresorhus/import-from/issues/9 (reference to loader hooks)
