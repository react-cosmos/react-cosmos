# Custom bundler setup

React Cosmos is made out of three main parts: The Server, the Renderer and the UI. Setting up a custom bundler setup consists of serving the Renderer yourself, without having to do anything special to the Server or the UI. But don't worry, Cosmos provides easy-to-use Renderer primitives that make it easy to create a custom setup.

First, install React Cosmos including the DOM package.

```bash
npm i -D react-cosmos@next react-cosmos-dom@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos@next react-cosmos-dom@next
```

Next, choose a port for the renderer other than the main Cosmos port, say `5050`. Set the renderer URL with the chosen port in your `cosmos.config.json`.

```json
{
  "port": 5000,
  "rendererUrl": "http://localhost:5050"
}
```

Next, start Cosmos with the `--external-userdeps` CLI flag. This will generate a `cosmos.userdeps.js` module that contains maps of user module imports (fixtures and decorators) as well the renderer config. Feel free to add this file to .gitignore.

Finally, create a web server using your bundler of choice that serves an `index.html`, which loads a JS module with the following code:

```js
import { mountDomRenderer } from 'react-cosmos-dom';
import * as mountArgs from './cosmos.userdeps.js';

mountDomRenderer(mountArgs);
```

That's it, really. The Cosmos Server will automatically update `cosmos.userdeps.js` when fixture/decorator files are added, changed or removed.

To learn how turn your setup into a Cosmos plugin check out the [Vite plugin](../packages/react-cosmos-plugin-vite).

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
