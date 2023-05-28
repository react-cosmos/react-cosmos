# React Native

This guide applies to React Native in general, including (but not limited to) Expo projects.

## Getting started

Install the required packages:

```bash
npm i -D react-cosmos@next react-cosmos-native@next
```

Add `cosmos` script to package.json:

```json
"scripts": {
  "cosmos": "cosmos"
}
```

Create a basic fixture at `Hello.fixture.js`:

```jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default () => (
  <View style={styles.container}>
    <Text style={styles.text}>Hello World!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});
```

Start React Cosmos:

```bash
npm run cosmos
```

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

> You'll notice Cosmos generated a `cosmos.imports.js` module, which becomes relevant in the next step. You can add this file to .gitignore.

The `Hello` fixture will show up in your React Cosmos UI.

**Nice, almost done 👍**

At this point Cosmos should successfully read your fixtures. One more step before you can render them.

### Set up the React Native renderer

This is very similar to a [custom bundler setup](customBundlerSetup.md). Cosmos cannot plug itself automatically into React Native's build pipeline (Metro), but you can do it with minimal effort.

Here's a basic file structure to get going. You can tweak this after everything's working.

1. Your production app entry point: `App.main.js`.
2. Your Cosmos renderer entry point: `App.cosmos.js`.
3. The root entry point that decides which to load: `App.js`.

> If you're using TypeScript replace `.js` file extensions with `.tsx`.

First, rename your existing `App.js` to `App.main.js`.

Then add the Cosmos renderer under `App.cosmos.js`:

```jsx
// App.cosmos.js
import React, { Component } from 'react';
import { NativeFixtureLoader } from 'react-cosmos-native';
import { rendererConfig, moduleWrappers } from './cosmos.imports';

export default class CosmosApp extends Component {
  render() {
    return (
      <NativeFixtureLoader
        rendererConfig={rendererConfig}
        moduleWrappers={moduleWrappers}
      />
    );
  }
}
```

Finally, create a new `App.js` that routes between your main and Cosmos entry points based on enviromnent:

```js
// App.js
module.exports = global.__DEV__
  ? require('./App.cosmos')
  : require('./App.main');
```

That's it!

Open your app in the simulator and the Cosmos renderer should say "No fixture selected". Go back to your React Cosmos UI, click on the `Hello` fixture and it will render in the simulator.

**Congratulations 😎**

You've taken the first step towards designing reusable components. You're ready to prototype, test and interate on components in isolation.

## App fixture

You'll often want to load the entire app in development. The simplest way to do this without disconnecting the Cosmos entry point is to create an App fixture:

```jsx
// App.fixture.js
import App from './App.main';

export default () => <App />;
```

## Initial fixture

You can configure the Cosmos Native renderer to auto load a fixture on init.

```diff
<NativeFixtureLoader
  rendererConfig={rendererConfig}
  moduleWrappers={moduleWrappers}
+ initialFixtureId={{ path: 'src/__fixtures__/HelloWorld.ts' }}
/>
```

`initialFixtureId` expects a fixture path relative to the project root. You'll find the exact path in `cosmos.imports.js` as a key in the `fixtures` object.

## Troubleshooting

- React Native blacklists `__fixtures__` dirs by default (at least it used to). Unless you configure Cosmos to use a different directory pattern, you need to [override `getBlacklistRE` in the React Native CLI config](https://github.com/skidding/jobs-done/blob/585b1c472a123c9221dfec9018c9fa1e976d715e/rn-cli.config.js).

## React Native for Web

You can get Cosmos to [mirror your fixtures on both DOM and Native renderers](https://twitter.com/ReactCosmos/status/1156147491026472964) using the following steps:

1. Set up Cosmos for Native using the steps above.
2. Set up the react-cosmos-webpack-plugin as described [here](README.md#getting-started).
3. Start Cosmos with the `cosmos --expose-imports` command.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
