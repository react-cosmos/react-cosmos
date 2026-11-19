import type { CosmosConfig, DevServerPluginArgs } from 'react-cosmos';
import { getHttpsCreds } from 'react-cosmos';
import { pickRendererUrl } from 'react-cosmos-core';
import type { InlineConfig, ViteDevServer } from 'vite';
import { createServer } from 'vite';
import type { CosmosViteConfig } from './createCosmosViteConfig.js';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import { reactCosmosViteRollupPlugin } from './reactCosmosViteRollupPlugin.js';
import { viteMiddlewarePlugin } from './viteMiddlewarePlugin.js';

export async function viteDevServerPlugin(args: DevServerPluginArgs) {
  const { config, platform } = args;
  if (platform !== 'web') return;

  const rendererUrl = pickRendererUrl(config.rendererUrl, 'dev');
  if (!rendererUrl) {
    throw new Error('Vite plugin requires config.rendererUrl to be set');
  }

  // The renderer URL decides where the renderer is served from. A relative
  // URL (the default) points to the Cosmos server, and Vite is attached to it.
  // An absolute URL points to a server of its own, which Vite then starts.
  const cosmosViteConfig = createCosmosViteConfig(config);
  const absoluteUrl = parseAbsoluteUrl(rendererUrl);
  const server = absoluteUrl
    ? await startViteServer(config, cosmosViteConfig, absoluteUrl)
    : await attachViteServer(args, cosmosViteConfig, rendererUrl);

  return async () => {
    await server.close();
  };
}

async function attachViteServer(
  { config, httpServer, app }: DevServerPluginArgs,
  cosmosViteConfig: CosmosViteConfig,
  rendererUrl: string
): Promise<ViteDevServer> {
  const rendererPath = new URL(rendererUrl, 'http://localhost').pathname;

  const serverPromise = createServer({
    ...getBaseViteConfig(config, cosmosViteConfig),
    // The Cosmos UI lives at the server root. Vite only serves the renderer's
    // HTML and the modules it loads, and passes on any other request.
    appType: 'custom',
    server: {
      middlewareMode: { server: httpServer },
      // Vite doesn't listen on this port in middleware mode, but its client
      // uses it to reach the server when the regular socket connection fails
      port: config.port,
    },
    plugins: [
      reactCosmosViteRollupPlugin(config, cosmosViteConfig, 'dev'),
      viteMiddlewarePlugin({
        rootDir: config.rootDir,
        rendererPath,
        httpServer,
      }),
    ],
  });

  // The Cosmos UI is up before Vite, so renderer requests made in the
  // meantime wait for Vite instead of failing
  app.use(async (req, res, next) => {
    try {
      const server = await serverPromise;
      server.middlewares(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  return serverPromise;
}

async function startViteServer(
  config: CosmosConfig,
  cosmosViteConfig: CosmosViteConfig,
  rendererUrl: URL
): Promise<ViteDevServer> {
  const server = await createServer({
    ...getBaseViteConfig(config, cosmosViteConfig),
    server: {
      // https://vitejs.dev/config/server-options.html#server-host
      host: '0.0.0.0',
      port: getUrlPort(rendererUrl),
      // The Cosmos UI is already pointing to this port, so the renderer can't
      // move to another one if the port is taken
      strictPort: true,
      https: config.https ? await getHttpsCreds(config) : undefined,
      // Prevent auto opening Cosmos renderer in browser when user has this
      // option enabled in their Vite config
      open: false,
    },
    plugins: [reactCosmosViteRollupPlugin(config, cosmosViteConfig, 'dev')],
  });

  try {
    await server.listen();
  } catch (err) {
    await server.close();
    throw err;
  }

  return server;
}

function getBaseViteConfig(
  config: CosmosConfig,
  cosmosViteConfig: CosmosViteConfig
): InlineConfig {
  return {
    // Last time I checked the config file is merged with this inline config:
    // https://github.com/vitejs/vite/blob/07bd6d14e545d05c6a29cf341f117fcfe9536ba4/packages/vite/src/node/config.ts#L418
    configFile: cosmosViteConfig.configPath,
    root: config.rootDir,
    base: config.publicUrl,
  };
}

function parseAbsoluteUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function getUrlPort(url: URL) {
  if (url.port) return parseInt(url.port, 10);
  return url.protocol === 'https:' ? 443 : 80;
}
