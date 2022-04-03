# Moving Cosmos to ES modules

This document tracks the progress with converting the Cosmos codebase to [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-move-my-commonjs-project-to-esm).

This is a worthy goal but not a top priority because:

1. Cosmos is not a low level library imported by other libraries. It's a dev sandbox that users interface with via GUI, CLI, or through code APIs used in fixture and test files, which aren't published as dependencies for other consumers.
2. Node ES modules are backwards compatible and [can import CommonJS modules](https://nodejs.org/api/esm.html#interoperability-with-commonjs) by design.
3. CJS or ESM, the Cosmos source requires compilation before publishing anyway because of using TypeScript.

That said, converting the compiled code to ESM is advantageous because:

1. All non-server Cosmos code would run natively in the browser without requiring bundling. Not sure if we'll ever want to load the Playground unbundled, but **allowing users to use unbundled ESM for fixtures is of interest**. This requires at least the fixture helpers to be published as ESM instead of CJS.
2. Server-side APIs like `getFixtures` could be called in ESM packages (with type: "module" in package.json). Even though ESM can call CJS, Cosmos would would still crash in this environment due to usage of CJS features like `__dirname` or `require.resolve` (**LATTER CLAIM REQUIRES VALIDATION**).

### What makes the transition tough?

- `require.resolve` doesn't have a simple alternative because `import.meta.resolve` is still experimental (requires Node flag) and `module.createRequire` seems limited – it doesn't seem to resolve modules in the same way (**REQUIRES FURTHER TESTING**).
- `require`-ing modules needs to be replaced with async `import()` which only supports JSON [experimentally](https://nodejs.org/docs/latest-v15.x/api/esm.html#esm_no_json_module_loading) at the moment. Opening JSON files could be replaced with `fs.readFile`.
- `__dirname` and `__firname` usage needs to be refactored using [`import.meta.url`](https://nodejs.org/docs/latest-v15.x/api/esm.html#esm_import_meta_url).

### Other mentions

- The transition might potentially introduce issues with Jest mocking (**REQUIRES TESTING**).
- This probably doesn't affect how Cosmos integrates with package managers like Berry or PnP.

### Further reading

- https://blog.logrocket.com/es-modules-in-node-today/
- https://nodejs.org/api/esm.html#differences-between-es-modules-and-commonjs
- https://nodejs.org/api/module.html#modulecreaterequirefilename
- https://nodejs.org/docs/latest-v15.x/api/esm.html#esm_loaders
- https://nodejs.org/docs/latest-v17.x/api/esm.html#importmetaresolvespecifier-parent
- https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-move-my-commonjs-project-to-esm
- https://github.com/sindresorhus/import-from/issues/9 (reference to loader hooks)
