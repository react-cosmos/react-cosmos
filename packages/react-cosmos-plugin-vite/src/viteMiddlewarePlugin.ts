import fs from 'node:fs/promises';
import type http from 'node:http';
import path from 'node:path';
import type { Connect, Plugin, ViteDevServer } from 'vite';
import { send, version } from 'vite';

type Args = {
  rootDir: string;
  // The path the renderer is served from on the Cosmos server
  rendererPath: string;
  httpServer: http.Server;
};

// What Vite needs to serve the renderer as a middleware of the Cosmos server,
// instead of running a server of its own
export function viteMiddlewarePlugin({
  rootDir,
  rendererPath,
  httpServer,
}: Args): Plugin {
  return {
    name: 'react-cosmos-vite-middleware',

    // Vite's hot reloading socket also goes through the Cosmos server. Left
    // alone, Vite opens a socket server on a fixed port (24678) in middleware
    // mode, which Cosmos instances running side by side would fight over.
    config(viteConfig) {
      // Vite 8.1 moved the socket options from server.hmr to server.ws
      const optionsKey = isViteVersionAtLeast(8, 1) ? 'ws' : 'hmr';
      const socketOptions = viteConfig.server?.[optionsKey];

      // The socket was either turned off in the Vite config or it was given a
      // place of its own, and both are for the user to decide. Note that
      // before 8.1 Vite still opens a socket (on its default port) to reload
      // the page when hot reloading is off.
      if (
        socketOptions === false ||
        (typeof socketOptions === 'object' &&
          (socketOptions.port || socketOptions.server))
      ) {
        return undefined;
      }

      return { server: { [optionsKey]: { server: httpServer } } };
    },

    configureServer(server) {
      // Returning a function adds the middleware after Vite's own, which is
      // where Vite serves index.html when it runs its own server
      return () => {
        server.middlewares.use(createRendererHtmlMiddleware(server));
      };
    },
  };

  function createRendererHtmlMiddleware(
    server: ViteDevServer
  ): Connect.NextHandleFunction {
    return async (req, res, next) => {
      const url = req.originalUrl ?? req.url ?? '';
      const isRendererRequest =
        (req.method === 'GET' || req.method === 'HEAD') &&
        url.split('?')[0] === rendererPath;

      if (!isRendererRequest) {
        next();
        return;
      }

      try {
        // The renderer's HTML is the user's index.html, same as in a static
        // export, even though it isn't served from the server root
        const html = await server.transformIndexHtml(
          '/index.html',
          await readIndexHtml(server),
          url
        );
        send(req, res, html, 'html', {
          headers: server.config.server.headers,
        });
      } catch (err) {
        next(err);
      }
    };
  }

  async function readIndexHtml(server: ViteDevServer) {
    const htmlPath = path.resolve(rootDir, 'index.html');
    // Other plugins might intercept <root>/index.html and resolve it to a
    // different path (same as when the main script URL is detected)
    const resolved = await server.pluginContainer.resolveId(htmlPath);
    return fs.readFile(resolved?.id ?? htmlPath, 'utf-8');
  }
}

function isViteVersionAtLeast(major: number, minor: number) {
  const [viteMajor, viteMinor] = version.split('.').map(Number);
  return viteMajor > major || (viteMajor === major && viteMinor >= minor);
}
