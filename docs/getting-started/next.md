# Next.js

> _**Warning** React Server Components and Next.js App Router are new technologies and their integration with React Cosmos is fresh from the oven. That said, get ready for something awesome!_

This guide covers how to integrate React Cosmos with Next.js 13.4+. It includes support for **React Server Components**. The Cosmos Renderer switches seamlessly between Server and Client components in the same project.

Also check out [react-cosmos/nextjs-example](https://github.com/react-cosmos/nextjs-example), which features both Server and Client fixtures of the glorious [react-tweet](https://github.com/vercel-labs/react-tweet) component.

## Getting started

Create a [new Next.js project](https://nextjs.org/docs/getting-started/installation) or open an existing one.

Install the required packages:

```bash
npm i -D react-cosmos@next react-cosmos-next@next
```

Create `cosmos.config.json` and point `rendererUrl` to your renderer (we'll get back to it in a moment):

```json
{
  "rendererUrl": {
    "dev": "http://localhost:3000/cosmos/<fixture>",
    "export": "/cosmos/<fixture>.html"
  }
}
```

Add `cosmos` and `cosmos-export` scripts to package.json:

```json
"scripts": {
  "cosmos": "cosmos --expose-imports",
  "cosmos-export": "cosmos-export --expose-imports"
}
```

Create a basic fixture at `src/Hello.fixture.jsx`:

```jsx
export default <h1>Hello World!</h1>;
```

Create a Next.js page at `src/app/cosmos/[fixture]/page.tsx`:

```jsx
import { nextCosmosPage, nextCosmosStaticParams } from 'react-cosmos-next';
import * as cosmosImports from '../../../../cosmos.imports';

export const generateStaticParams = nextCosmosStaticParams(cosmosImports);

export default nextCosmosPage(cosmosImports);
```

This is your Next.js Cosmos renderer.

> If you're using TypeScript replace `.jsx` file extensions with `.tsx`.

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

### Limitations

- Only single function fixtures can be exported from a fixture module with the `'use client'` descriptor. That's because Client fixture modules are passed _as is_ to the Server render tree and their exports are expected to be component types by design. While other fixture formats (React Node exports or multi fixture exports) cannot be used in Client fixtures, all Cosmos fixture formats as supported in Server fixtures.

## Static export

The `cosmos-export` command creates a static export of the Cosmos UI shell, which expects a corresponding static Renderer to connect with. Generating the complete export requires stringing a few simple commands together:

```bash
# Build Cosmos
npm run cosmos-export
# Build Next.js
npm run build
# Copy Next.js build into Cosmos export
cp -R ./out/_next ./cosmos-export
cp -R ./out/cosmos ./cosmos-export
```

At this point your static export is ready to be served:

```bash
npx http-server ./cosmos-export
```

👀 **[Live demo](https://cosmos-nextjs.vercel.app)**

## Let's make this better

Running Server Components in Cosmos is awesome but a plugin could take this integration to the next level (no pun intended).

Similar to the Vite and Webpack plugins, a Next.js plugin would:

- Remove the need to wire up the Cosmos Renderer (the `/cosmos` page).
- Hide the user module mappings (the `cosmos.imports` file generated with the `--expose-imports` flag).
- Set the renderer URL automatically with no Cosmos config needed.
- Support static exports out of the box with the `cosmos-export` command.

Making a Cosmos plugin is easy-peasy. Plugging into Next.js is the missing link for a seamless integration.

Ideally we would call the `dev` and `build` Next.js commands programatically. But I don't know if Next.js supports this at the moment. There is a [Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server) API but I'm not sure if it works with the App Router architecture and the build part is missing.

In the meantime we can remove the `/cosmos` page from the _out_ dir when deploying our app. Another option is a monorepo with a main Next.js app and a Cosmos Next.js app.

> _If you or someone you know has Next.js expertise please don't be shy and reach out. Any help here is appreciated!_

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
