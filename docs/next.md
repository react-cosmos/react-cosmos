# Next.js

> _**Warning**: You're entering the realm of cutting edge tech. React Server Components, Next.js App Router and React Cosmos 6 are all new. See [Limitations](#limitations) and [Next steps](#next-steps) for the complete picture. That said, get ready for some awesome!_

This guide covers how to integrate React Cosmos with Next.js 13.4+. It includes support for **React Server Components**. The Cosmos Renderer switches seamlessly between Server and Client components in the same project.

Check out [react-cosmos/nextjs-example](https://github.com/react-cosmos/nextjs-example), which features both Server and Client fixtures of the glorious [react-tweet](https://github.com/vercel-labs/react-tweet) component.

## Getting started

Create a [new Next.js project](https://nextjs.org/docs/getting-started/installation) or open an existing one.

Install React Cosmos:

```bash
npm i -D react-cosmos@next react-cosmos-next@next
```

Or if you’re using Yarn:

```bash
yarn add --dev react-cosmos@next react-cosmos-next@next
```

Create a basic fixture at `src/hello-world.fixture.jsx`:

```jsx
export default <h1>Hello World!</h1>;
```

> If you're using TypeScript replace `.jsx` file extensions with `.tsx`.

Create a Next page at `src/app/cosmos/page.jsx`:

```jsx
import { NextFixtureLoader } from 'react-cosmos-next';
import { moduleWrappers, rendererConfig } from '../../../cosmos.imports';

export default ({ searchParams }) => {
  return (
    <NextFixtureLoader
      rendererConfig={rendererConfig}
      moduleWrappers={moduleWrappers}
      searchParams={searchParams}
    />
  );
};
```

This is your Cosmos Renderer. We'll get back to it in a minute.

Create `cosmos.config.json` and point `rendererUrl` to your Next Cosmos Renderer:

```json
{
  "rendererUrl": "http://localhost:3000/cosmos"
}
```

Add `package.json` script:

```diff
"scripts": {
+  "cosmos": "cosmos --expose-imports"
}
```

Start React Cosmos:

```bash
npm run cosmos
```

Or if you’re using Yarn:

```bash
yarn cosmos
```

> You'll notice `cosmos.imports.js` was generated. This module is a dependency of the Cosmos Renderer. The Cosmos Server updates this file automatically. You can add it to .gitignore.

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

That's it. You're now running Server fixtures in React Cosmos!

You can import both Server and Client components in your fixtures, which run on the server by default. You can also add the `'use client'` directive to a fixture module (or decorator) if you want use Hooks inside it.

## Limitations

- Only single function fixtures can be exported from a fixture module with the `'use client'` descriptor. That's because Client fixtures are passed to the Server render tree as component types without being picked up by Cosmos first. While other fixture formats (React Node exports or multi fixture exports) cannot be used in Client fixtures, all Cosmos fixture formats as supported in Server fixtures.
- So far this is a dev server-only setup. It's already possible to export a static Cosmos UI that connects to a built Cosmos Renderer (as done [here](https://cosmos-reactjs.vercel.app/)). In this case the Renderer is essentially a live Next.js app. Ideally we'd also support completely static exports. Next.js can generate static exports of Server components by rendering them at build time. But at the moment the `NextFixtureLoader` uses the `searchParams` prop, which opts Next into [dynamic rendering](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering#dynamic-rendering).

## Next steps

- TODO.

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
