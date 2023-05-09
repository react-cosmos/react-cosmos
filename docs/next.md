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

Create a basic fixture at `src/hello-world.fixture.jsx`:

```jsx
export default <h1>Hello World!</h1>;
```

> If you're using TypeScript replace `.jsx` file extensions with `.tsx`.

Create a Next.js page at `src/app/cosmos/page.jsx`:

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

- Only single function fixtures can be exported from a fixture module with the `'use client'` descriptor. That's because Client fixtures are passed to the Server render tree as component types without being picked up by Cosmos first. While other fixture formats (React Node exports or multi fixture exports) cannot be used in Client fixtures, all Cosmos fixture formats as supported in Server fixtures.

## Next steps

### Static exports

So far this is a dev server-only setup. It's already possible to export a static Cosmos UI that connects to a built Cosmos Renderer (as done [here](https://cosmos-nextjs.vercel.app)). In this case the Renderer is essentially a live Next.js app. Ideally we'd also support completely static exports. Next.js can generate static exports of Server components by rendering them at build time. But because the `NextFixtureLoader` component uses the `searchParams` Page prop Next.js resorts to [dynamic rendering](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering#dynamic-rendering).

At the moment the Next.js Cosmos Renderer uses URL search params for routing. This works well in development but isn't suited for static generation. Instead, [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) could be used in combination with dynamic route segments (eg. `/cosmos/[fixtureId]`) to statically generate fixture routes at build time. This needs to be explored.

### Next.js plugin

Similar to the Vite and Webpack plugins, a Next.js plugin would:

- Remove the need to wire up the Cosmos Renderer (the `/cosmos` page).
- Hide the user module mappings (the `cosmos.imports` file generated with the `--expose-imports` flag).
- Set the renderer URL automatically with no config needed.
- Support static exports out of the box with the `cosmos-export` command.

Making a Cosmos plugin is easy-peasy. _Docs for it will come soon, too, I promise._ The hard(er) part here is figuring out how to plug into Next.js for the following:

- _How to automatically create a `/cosmos` page and inject the `cosmos.imports` module under the hood?_
- _How to omit the `/cosmos` page in production?_
- _How to only build the `/cosmos` page when creating a static export?_

If you or someone you know has answers to these questions please don't be shy. I'd greatly appreciate some Next.js insights for improving this integration!

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
