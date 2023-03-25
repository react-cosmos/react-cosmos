# React Cosmos 6 migration guide

> We're also migrating our community from Slack to Discord. [Join our brand new Discord Server](https://discord.gg/3X95VgfnW5) to interact with fellow Cosmonauts.

## Installation

```
npm install --dev react-cosmos@alpha react-cosmos-plugin-webpack@alpha
```

Or if you’re using Yarn:

```
yarn add --dev react-cosmos@alpha react-cosmos-plugin-webpack@alpha
```

Install `react-cosmos-plugin-vite` instead of `react-cosmos-plugin-webpack` to use React Cosmos with Vite.

> Replace `alpha` with `canary` if you want to get the bleeding edge versions (latest commit from the main branch).

This major version accomplishes the following:

- Codebase brought up to date with standards and dependencies.
- Webpack plugin extracted from core packages.
- New Vite plugin.
- In progress: Official APIs for both bundler and UI plugins.
- Other project improvements mentioned in [Roadmap](https://github.com/react-cosmos/react-cosmos/blob/main/docs/roadmap/README.md).

> The packages are published as _alpha_ versions to allow for changes to the plugin APIs as feedback rolls in. That said the core functionality should work as reliably as before if not more.

## Breaking changes

- Dropped Node <14 support.
- Dropped IE support.
- Migrated to React 18.

Dropping backwards compatibility with older versions of Node, browsers or React might be unfortunate for some but it's the only way to move forward. It allowed us to get the codebase into a much better shape by minimizing 3rd party dependencies and publishing ESM modules.

### Webpack plugin

Webpack is no longer built-in the main React Cosmos packages. To set up a webpack codebase you need to install `react-cosmos-plugin-webpack` and add it to the list of plugins in your Cosmos config.

```json
"plugins": ["react-cosmos-plugin-webpack"]
```

### Vite plugin

React Cosmos 6 comes with a brand new Vite plugin, too. To set up a Vite codebase you need to install `react-cosmos-plugin-vite` and add it to the list of plugins in your Cosmos config.

```json
"plugins": ["react-cosmos-plugin-vite"]
```

> The Vite plugin is still in its infancy. It works great but it likely needs to allow more customization. Please send feedback on Discord and help us refine it.

### Other breaking changes

- `react-cosmos/fixture` exports moved to react-cosmos-core (eg. `import { useValue } from 'react-cosmos-core'`).
- `getFixtures2()` renamed to `getFixtures()`.
- `getCosmosConfigAtPath()` is now async. To replicate the old sync behavior require the config module manually and pass it to `createCosmosConfig()`.
- `topLevelAwait` webpack setting is required (see example [here](https://github.com/react-cosmos/react-cosmos/blob/88f992bbcbf954fd8b4b672362efd0d50fcb9885/packages/react-cosmos-ui/webpack.config.cosmos.js#L44-L46)).
- For visual regression testing you may need to make Jest transpile Cosmos modules by adding `/node_modules/react-cosmos` to `transformIgnorePatterns` in your Jest config.

There might be some other subtle breaking changes, especially if you're implementing a custom Cosmos renderer or if you're integrated with a bundler other than webpack. Please send us a message on Discord if this is the case and we'll do our best to help you with the migration.
