# React Cosmos 6 migration guide

> We're also migrating our community from Slack to Discord. [Join our brand new Discord Server](https://discord.gg/3X95VgfnW5) to interact with fellow Cosmonauts.

## Installation

[![npm version](https://img.shields.io/npm/v/react-cosmos/next.svg?style=flat)](https://www.npmjs.com/package/react-cosmos)

```
npm i -D react-cosmos@next react-cosmos-plugin-webpack@next
```

Or if you’re using Yarn:

```
yarn add --dev react-cosmos@next react-cosmos-plugin-webpack@next
```

Install `react-cosmos-plugin-vite` instead of `react-cosmos-plugin-webpack` to use React Cosmos with Vite.

> Replace `next` with `canary` if you want to get the bleeding edge versions (latest commit from the main branch).

This major version accomplishes the following:

- Codebase brought up to date with standards and dependencies.
- Webpack plugin extracted from core packages.
- New Vite plugin.
- In progress: Official APIs for both bundler and UI plugins.
- Other project improvements mentioned in [Roadmap](https://github.com/react-cosmos/react-cosmos/blob/main/docs/roadmap/README.md).

> The packages are published as alpha versions to allow for changes to the plugin APIs as feedback rolls in. That said the core functionality should work as reliably as before if not more.

## Breaking changes

- Dropped Node <14 support.
- Dropped IE support.
- Migrated to React 18.

Dropping backwards compatibility with older versions of Node, browsers or React might be unfortunate for some but it's the only way to move forward. It allowed us to get the codebase into a much better shape by minimizing 3rd party dependencies and publishing ESM modules.

### Webpack plugin

Webpack support is no longer included in the core React Cosmos packages. To set up a webpack codebase you need to install `react-cosmos-plugin-webpack` and add it to the list of plugins in your Cosmos config.

```json
"plugins": ["react-cosmos-plugin-webpack"]
```

### Vite plugin

React Cosmos 6 also comes with a brand new Vite plugin. To set up a Vite codebase you need to install `react-cosmos-plugin-vite` and add it to the list of plugins in your Cosmos config.

```json
"plugins": ["react-cosmos-plugin-vite"]
```

> The Vite plugin is still in its infancy. It works great but it likely needs to allow more customization. Please send feedback on [Discord](https://discord.gg/3X95VgfnW5) and help us refine it.

### Other breaking changes

- `react-cosmos/fixture` exports moved to react-cosmos-core (eg. `import { useValue } from 'react-cosmos-renderer/client'`).
- `NativeFixtureLoader` component moved from `react-cosmos/native` to new `react-cosmos-native` package. Install `react-cosmos-native@next` as well for a React Native setup.
- `getFixtures2()` renamed to `getFixtures()`.
- `getCosmosConfigAtPath()` is now async. To replicate the old sync behavior, require() the config module manually and pass it to `createCosmosConfig()`.
- For visual regression testing you may need to make Jest transpile Cosmos modules by adding `"/node_modules/react-cosmos"` to `transformIgnorePatterns` in your Jest config.

There might be some other subtle breaking changes, especially if you're implementing a custom Cosmos renderer or if you're integrated with a bundler other than webpack. Create an issue or send us a message on [Discord](https://discord.gg/3X95VgfnW5) if this is the case and we'll do our best to help you with the migration.

### Next steps

A rough outline for this release:

1. Get the alpha in the user's hands, make sure everything webpack-related works well with the new plugin.
1. Close long-standing issues that were already addressed in this version (eg. PnP support).
1. Get feedback and add customization to the Vite plugin.
1. Document, get feedback and and stabilize the plugin APIs.
1. Revamp the docs and possibly the website, too.
1. Make v6 official and start rolling out new features.

Please [join us on Discord](https://discord.gg/3X95VgfnW5) on this journey to take React Cosmos to the next level!
