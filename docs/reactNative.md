# React Native

This guide applies to React Native in general, including (but not limited to) Expo projects.

## Getting started

1\. **Install React Cosmos**

```bash
npm i -D react-cosmos@next react-cosmos-native@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos@next react-cosmos-native@next
```

2\. **Add package.json script**

```diff
"scripts": {
+  "cosmos": "cosmos-native"
}
```

3\. **Start React Cosmos**

```bash
npm run cosmos
```

Or if you’re using Yarn:

```bash
yarn cosmos
```

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

> You'll notice Cosmos generated a `cosmos.userdeps.js` module, which becomes relevant in step 5. You can add this file to .gitignore.

4\. **Create your first fixture**

Choose a simple component to get started.

<!-- prettier-ignore -->
```jsx
// Hello.js
import React from 'react';
import { Text } from 'react-native';

export function Hello({ greeting, name }) {
  return <Text>{greeting}, {name}!</Text>;
}
```

Create a `.fixture` file.

> Fixture files contain a default export, which can be a React Component or any React Node.

```jsx
// Hello.fixture.js
import React from 'react';
import { Hello } from './Hello';

export default <Hello greeting="Aloha" name="Alexa" />;
```

The `hello` fixture will show up in your React Cosmos UI.

**Nice, almost done 👍**

At this point Cosmos should successfully read your fixtures. One more step before you can render them.

5\. **Set up the React Native renderer**

This is very similar to a [custom bundler setup](customBundlerSetup.md). Cosmos cannot plug itself automatically into React Native's build pipeline (Metro), but you can do it with minimal effort.

Replace your `App.js` entrypoint with the following code:

```jsx
// App.js
import React, { Component } from 'react';
import { NativeFixtureLoader } from 'react-cosmos-native';
import { rendererConfig, moduleWrappers } from './cosmos.userdeps.js';

export default class App extends Component {
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

This is a temporary solution to get going with Cosmos. Once you see your fixtures rendering properly you'll probably want to split your App entry point to load Cosmos in development and your root component in production. Something like this:

```js
// App.js
module.exports = global.__DEV__
  ? require('./App.cosmos')
  : require('./App.main');
```

Where `App.cosmos.js` contains the code above that renders `NativeFixtureLoader` and `App.main.js` contains your original App.js.

## Initial fixture

You can configure the Cosmos Native renderer to auto load a fixture on init.

```diff
<NativeFixtureLoader
  rendererConfig={rendererConfig}
  moduleWrappers={moduleWrappers}
+ initialFixtureId={{ path: 'Hello.fixture.js' }}
/>
```

## Troubleshooting

- React Native blacklists `__fixtures__` dirs by default (at least it used to). Unless you configure Cosmos to use a different directory pattern, you need to [override `getBlacklistRE` in the React Native CLI config](https://github.com/skidding/jobs-done/blob/585b1c472a123c9221dfec9018c9fa1e976d715e/rn-cli.config.js).

## React Native for Web

You can get Cosmos to [mirror your fixtures on both DOM and Native renderers](https://twitter.com/ReactCosmos/status/1156147491026472964) using the following steps:

1. Set up Cosmos for Native using the steps above.
2. Set up the react-cosmos-webpack-plugin as described [here](README.md#getting-started).
3. Start Cosmos with the `cosmos --external-userdeps` command.

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
