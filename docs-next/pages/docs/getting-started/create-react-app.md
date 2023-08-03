# Create React App

This is a guide for setting up React Cosmos in a Create React App project.

## Getting Started

Install the required packages:

```bash npm2yarn
npm i -D react-cosmos@next react-cosmos-plugin-webpack@next
```

This is a `cosmos.config.json` example for Create React App:

```json
{
  "plugins": ["react-cosmos-plugin-webpack"],
  "staticPath": "public",
  "watchDirs": ["src"],
  "webpack": {
    "configPath": "react-scripts/config/webpack.config"
  }
}
```

Add `cosmos` and `cosmos-export` scripts to package.json:

```json
"scripts": {
  "cosmos": "FAST_REFRESH=false cosmos",
  "cosmos-export": "cosmos-export",
}
```

> Your mileage may vary, but using CRA's internal webpack config inside Cosmos has caused React Refresh [issues](https://github.com/react-cosmos/react-cosmos/issues/1272) in the past. You can disable it as shown above or you may also _not_ set `webpack.configPath` to `"react-scripts/config/webpack.config"` and have Cosmos run with a more minimalistic alternative to the [CRA webpack config](https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-scripts/config/webpack.config.js).

Create a basic fixture at `src/Hello.fixture.jsx`;

```jsx
export default <h1>Hello World!</h1>;
```

> **Note** Fixture files must be placed in the `src` directory when using Create React App.

Start React Cosmos:

```bash
npm run cosmos
```

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

The `Hello` fixture will show up in your Cosmos UI and will render when you select it.

**Congratulations 😎**

You've taken the first step towards designing reusable components. You're ready to prototype, test and interate on components in isolation.

## Using react-app-rewired

In a standard Create React App setup you config React Cosmos to use CRA's internal Webpack config (see above). With react-app-rewired, however, create the following Webpack config in your project root instead.

```js filename="webpack.config.js"
const { paths } = require('react-app-rewired');
const overrides = require('react-app-rewired/config-overrides');
const config = require(paths.scriptVersion + '/config/webpack.config.dev');

module.exports = overrides.webpack(config, process.env.NODE_ENV);
```

> React Cosmos picks up `webpack.config.js` automatically. Use `webpack.configPath` to customize the Webpack config path.

## Using CRACO With Tailwind CSS

[CRACO](https://github.com/gsoft-inc/craco) is an alternative to react-app-rewired for overriding CRA's internal Webpack config. [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) recommends using CRACO to override CRA's PostCSS settings, which is why this guide targets CRACO and Tailwind CSS together.

- Create `webpack.config.js` in your root folder (if you haven't already) with the following contents:

```js filename="webpack.config.js"
const { createWebpackDevConfig } = require('@craco/craco');
const cracoConfig = require('./craco.config.js');
const webpackConfig = createWebpackDevConfig(cracoConfig);

module.exports = webpackConfig;
```

- If you're using Tailwind CSS or another similar CSS library, add your global CSS to `globalImports` in the Cosmos config. Create `cosmos.config.json` in your root folder (if you haven't already) with the following contents:

```json
{
  "globalImports": ["src/index.css"],
  "staticPath": "public"
}
```

> Cosmos picks up `webpack.config.js` automatically. Since you're relying on the exported wepack config generated by CRACO, don't forgot to remove `"webpack.configPath": "react-scripts/config/webpack.config"` from your `cosmos.config.json` if you previously set it. Use `webpack.configPath` if you prefer to customize the Webpack config path.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.