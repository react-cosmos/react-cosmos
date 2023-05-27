# Node.js API

> **Warning**: Do **NOT** use these APIs in your fixture files, or any of your client-side code, as they require access to the file system and may bundle unwanted Node.js code in your browser build.

## Cosmos config

Fetching a Cosmos config can be done in a number of ways, depending on whether or not you have a config file and, in case you do, if you prefer to specify the path manually or to rely on automatic detection.

### Detect existing config from current working directory (cwd)

`detectCosmosConfig` uses the same config detection strategy as the `cosmos` command.

```js
import { detectCosmosConfig } from 'react-cosmos';

const cosmosConfig = await detectCosmosConfig();
```

### Read existing config at exact path

`getCosmosConfigAtPath` is best when you don't want to care where you run a script from.

```js
import { getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = await getCosmosConfigAtPath(
  require.resolve('./cosmos.config')
);
```

### Create default config

The minimum requirement to create a config is a root directory.

```js
import { createCosmosConfig } from 'react-cosmos';

const cosmosConfig = createCosmosConfig(__dirname);
```

### Create custom config

You can also customize your config programatically, without the need for an external config file.

```js
import { createCosmosConfig } from 'react-cosmos';

const cosmosConfig = createCosmosConfig(__dirname, {
  // Options... (TypeScript is your friend)
});
```

## Fixtures

Get all your fixtures programatically. A ton of information is provided for each fixture, enabling you to hack away on top of React Cosmos. To generate visual snapshots from your fixtures, you load `rendererUrl` in a headless browser like [Puppeteer](https://github.com/puppeteer/puppeteer) and take a screenshot on page load. You can compare visual snapshots between deploys to catch sneaky UI regressions.

```js
import { getFixtures } from 'react-cosmos';

const fixtures = getFixtures(cosmosConfig, {
  rendererUrl: 'http://localhost:5000/renderer.html',
});

console.log(fixtures);
// [
//   {
//     "absoluteFilePath": "/path/to/components/pages/Error/__fixtures__/not-found.js",
//     "fileName": "not-found",
//     "name": null,
//     "parents": ["pages", "Error"]
//     "playgroundUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2Fpages%2FError%2F__fixtures__%2Fnot-found.js%22%2C%22name%22%3Anull%7D",
//     "relativeFilePath": "components/pages/Error/__fixtures__/not-found.js",
//     "rendererUrl": "http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22components%2Fpages%2FError%2F__fixtures__%2Fnot-found.js%22%2C%22name%22%3Anull%7D",
//     "treePath": ["pages", "Error", "not-found"]
//   },
//   ...
```

Aside from the fixture information showcased above, each fixture object returned also contains a `getElement` function property, which takes no arguments. `getElement` allows you to render fixtures in your own time, in environments like jsdom. Just as in the Cosmos UI, the fixture element will include any decorators you've defined for your fixtures. `getElement` can be used for Jest snapshot testing.

### Caveats

The `getFixtures()` API is tricky to work with.

To create renderer URLs for each fixture, all fixture modules are imported in order to retrieve the fixture names of _multi fixtures_. Fixture modules are non-standard (JSX or TypeScript modules) and often expect a DOM environment. Thus calling `getFixtures()` in a Node.js environment isn't straightforward and Jest with `"jsdom"` [testEnvironment](https://jestjs.io/docs/configuration#testenvironment-string) is the de facto way of using this API.

Jest brings its own array of problems due to its limitations:

1. [ESM support is unfinished.](https://github.com/jestjs/jest/issues/9430)
2. [You can't create test cases asynchronously.](https://github.com/jestjs/jest/issues/2235#issuecomment-584387443) Using an async `globalSetup` [could work](https://github.com/jestjs/jest/issues/2235#issuecomment-584387443), but it can't import ESM and we're back to square one.

For the reasons above `getFixtures()` is a synchronous API. It uses CommonJS `require()` to import user modules.

Another limitation due to the lack of ESM support in Jest is the fact that `getFixtures()` doesn't run server plugins. The config hooks of server plugins usually auto-set the `rendererUrl` option in the user's Cosmos config. The Vite and Webpack plugins do this. With `getFixtures()`, however, we pass the renderer URL as a separate option after the Cosmos config.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
