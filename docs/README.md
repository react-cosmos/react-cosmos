## Table of contents

> The current docs are for React Cosmos 6. Check out the [migration guide](getting-started/migration.md) to upgrade from v5.

- Setup: [Getting started](#getting-started) · [Config](#config) · [Compilation](#compilation) · [Webpack](#webpack)
- Usage: [Fixtures](#fixtures) · [Decorators](#decorators) · [Control panel](#control-panel) · [Static export](#static-export) · [React Native](reactNative.md) · [Server-side APIs](#server-side-apis)
- FAQ: [Create React App](#create-react-app) · [Next.js](next.md) · [Troubleshooting](#troubleshooting)

## Getting started

> This is a web guide. See [this guide](reactNative.md) for React Native.

1\. **Install React Cosmos**

```bash
npm i -D react-cosmos@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos@next
```

2\. **Set up bundler**

<details>
  <summary>Vite plugin</summary>

```bash
npm i -D react-cosmos-plugin-vite@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos-plugin-vite@next
```

Create `cosmos.config.json` and enable Vite plugin.

```json
{
  "plugins": ["react-cosmos-plugin-vite"]
}
```

</details>

<details>
  <summary>Webpack plugin</summary>

```bash
npm i -D react-cosmos-plugin-webpack@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos-plugin-webpack@next
```

Create `cosmos.config.json` and enable Webpack plugin.

```json
{
  "plugins": ["react-cosmos-plugin-webpack"]
}
```

</details>

<details>
  <summary>Next.js</summary>

[Check out this guide](next.md).

</details>

<details>
  <summary>Custom bundler setup</summary>

[Check out this guide](customBundlerSetup.md).

</details>

3\. **Add package.json scripts**

```diff
"scripts": {
+  "cosmos": "cosmos",
+  "cosmos:export": "cosmos-export"
}
```

4\. **Start React Cosmos**

```bash
npm run cosmos
```

Or if you’re using Yarn:

```bash
yarn cosmos
```

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

5\. **Create your first fixture**

Choose a simple component to get started.

<!-- prettier-ignore -->
```jsx
// Hello.jsx
import React from 'react';

export function Hello({ greeting, name }) {
  return <h1>{greeting}, {name}!</h1>;
}
```

Create a `.fixture` file.

> Fixture files contain a default export, which can be a React Component or any React Node.

```jsx
// Hello.fixture.jsx
import React from 'react';
import { Hello } from './Hello';

export default <Hello greeting="Aloha" name="Alexa" />;
```

The `Hello` fixture will show up in your React Cosmos UI and will render when you select it.

**Congratulations 😎**

You've taken the first step towards designing reusable components. You're ready to prototype, test and interate on components in isolation.

### Next steps...

- [Create a decorator](#decorators).
- [Check out Vite and Webpack examples](../examples).
- [Configure Cosmos config](#config).
- [Configure Webpack config](#webpack).

> Something wrong? Don't hesitate to [create a GitHub issue](https://github.com/react-cosmos/react-cosmos/issues/new/choose) (make sure to include details) and to [join us on Discord](https://discord.gg/3X95VgfnW5).

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
