# Next.js

> _**Warning**: React Server Components, Next.js App Router are new technologies and their integration with React Cosmos is fresh from the oven. See [Limitations](#limitations) and [Next steps](#next-steps) for the full picture. That said, get ready for something awesome!_

This guide covers how to integrate React Cosmos with Next.js 13.4+. It includes support for **React Server Components**. The Cosmos Renderer switches seamlessly between Server and Client components in the same project.

You may also want to check out [react-cosmos/nextjs-example](https://github.com/react-cosmos/nextjs-example), which features both Server and Client fixtures of the glorious [react-tweet](https://github.com/vercel-labs/react-tweet) component.

[gif]

## Getting started

Create a [new Next.js project](https://nextjs.org/docs/getting-started/installation) or open an existing one.

Install React Cosmos:

```bash
npm i -D react-cosmos@next react-cosmos-next@next
```

Create a basic fixture at `src/hello-world.fixture.jsx`:

```jsx
export default <h1>Hello World!</h1>;
```

> If you're using TypeScript replace `.jsx` file extensions with `.tsx`.

Create a Next.js page at `src/app/cosmos/page.jsx`:

```jsx
import { nextCosmosRenderer } from 'react-cosmos-next';
import * as cosmosImports from '../../../cosmos.imports';

export default nextCosmosRenderer(cosmosImports);
```

This is your Cosmos Renderer. We'll get back to it in a minute.

Create `cosmos.config.json` and point `rendererUrl` to your Next.js Cosmos Renderer:

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

Start Next.js:

```bash
npm run dev
```

Start React Cosmos (in a 2nd terminal):

```bash
npm run cosmos
```

> You'll notice `cosmos.imports.js` was generated. This module is a dependency of the Cosmos Renderer. The Cosmos Server updates this file automatically. You can add it to .gitignore.

🚀 Open **[localhost:5000](http://localhost:5000)** in your browser.

That's it. You're now running Server fixtures in React Cosmos!

You can import both Server and Client components in your fixtures, which run on the server by default. You can also add the `'use client'` directive to a fixture module (or decorator) if you want use Hooks inside it.

## Limitations

- Only single function fixtures can be exported from a fixture module with the `'use client'` descriptor. That's because Client fixture modules are passed _as is_ to the Server render tree and their exports are expected to be component types. While other fixture formats (React Node exports or multi fixture exports) cannot be used in Client fixtures, all Cosmos fixture formats as supported in Server fixtures.
- So far this is a dev server-only setup. See [Static exports](#static-exports).

## Next steps

### Static exports

The `cosmos-export` command create a static export of the Cosmos UI shell, which expects a corresponding static Renderer to connect with. Getting the latter to work with Next.js is **work in progress:**

- [x] Step 1: Export a static Cosmos UI that connects to a built Next.js Cosmos Renderer. [Demo here](https://cosmos-nextjs.vercel.app). In this case the Renderer is essentially a live Next.js app. It's nice but a completely static export is more desirable.
- [ ] Step 2: Leverage dynamic route segments and [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) in Next.js to statically generate all fixtures at build time. This requires migrating the Cosmos Renderer away from query string routing (which trigger [dynamic rendering](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering#dynamic-rendering) in Next.js).

> _A working prototype has already been made for Step 2. Coming soon!_

### Next.js plugin

Similar to the Vite and Webpack plugins, a Next.js plugin would:

- Remove the need to wire up the Cosmos Renderer (the `/cosmos` page).
- Hide the user module mappings (the `cosmos.imports` file generated with the `--expose-imports` flag).
- Set the renderer URL automatically with no Cosmos config needed.
- Support static exports out of the box with the `cosmos-export` command.

Making a Cosmos plugin is easy-peasy. _Docs for it will come soon, too, I promise._ The hard(er) part here is figuring out how to plug into Next.js for the following:

- _How to automatically create a `/cosmos` page and inject the `cosmos.imports` module under the hood?_
- _How to omit the `/cosmos` page in production?_
- _How to only build the `/cosmos` page when creating a static export?_

If you or someone you know has answers to these questions please don't be shy. I'd greatly appreciate some Next.js insights for improving this integration!

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
