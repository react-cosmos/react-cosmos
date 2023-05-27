## Table of contents

> The current docs are for React Cosmos 6. Check out the [migration guide](getting-started/migration.md) to upgrade from v5.

## Getting started

- [Vite](getting-started/vite.md)
- [Webpack](getting-started/webpack.md)
- [React Native](getting-started/react-native.md)
- [Next.js](getting-started/next.md)
- [Create React App](getting-started/create-react-app.md)
- [Custom bundler setup](getting-started/custom-bundler.md)
- [Troubleshooting](getting-started/troubleshooting.md)

## Usage

- [Fixtures](usage/fixtures.md)
- [Decorators](usage/decorators.md)
- [Configuration](usage/configuration.md)
- [Static export](usage/static-export.md)
- [Node.js API](usage/node-api.md)

---

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

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
