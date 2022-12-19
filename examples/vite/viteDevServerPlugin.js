import { createServer } from 'vite';

export default async function viteDevServerPlugin({
  platformType,
  cosmosConfig,
  expressApp,
  sendMessage,
}) {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: new URL('.', import.meta.url).pathname,
    server: {
      port: 5050,
    },
  });
  await server.listen();

  server.printUrls();
}
