import { createServer } from 'vite';

export default async function viteDevServerPlugin({ cosmosConfig }) {
  const { rendererUrl } = cosmosConfig;
  if (!rendererUrl)
    throw new Error('Vite plugin requires cosmosConfig.rendererUrl');

  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: new URL('.', import.meta.url).pathname,
    server: {
      port: new URL(rendererUrl).port,
    },
  });
  await server.listen();

  server.printUrls();
}
