import fs from 'fs';
import http, { RequestListener } from 'http';
import https from 'https';
import pem from 'pem';
import { CosmosConfig } from '../cosmosConfig/types.js';

type OnStart = (httpServer: http.Server) => unknown;

export function createHttpServer(onStart: OnStart) {
  let _server: http.Server | https.Server | undefined;

  async function startServer(cosmosConfig: CosmosConfig, app: RequestListener) {
    const { port, hostname, https: httpsEnabled } = cosmosConfig;

    _server = httpsEnabled
      ? https.createServer(await getHttpsOpts(cosmosConfig), app)
      : http.createServer(app);

    handleStart(_server, cosmosConfig);

    onStart(_server);

    const hostnameDisplay = hostname || 'localhost';
    const protocol = httpsEnabled ? 'https' : 'http';
    console.log(`[Cosmos] See you at ${protocol}://${hostnameDisplay}:${port}`);
  }

  async function stopServer() {
    if (_server) await handleClose(_server);
  }

  return { startServer, stopServer };
}

type Credentials = { key: string; cert: string };

async function getHttpsOpts(cosmosConfig: CosmosConfig): Promise<Credentials> {
  const { httpsOptions } = cosmosConfig;
  if (httpsOptions)
    return {
      key: fs.readFileSync(httpsOptions.keyPath, 'utf8'),
      cert: fs.readFileSync(httpsOptions.certPath, 'utf8'),
    };

  console.log('[Cosmos] Generating HTTPS certificate');
  return await new Promise((resolve, reject) => {
    pem.createCertificate({ days: 1000, selfSigned: true }, (err, keys) => {
      if (err) return reject(err);
      return resolve({ key: keys.serviceKey, cert: keys.certificate });
    });
  });
}

async function handleStart(server: http.Server, cosmosConfig: CosmosConfig) {
  const { port, hostname } = cosmosConfig;
  await new Promise<void>(resolve => {
    if (hostname === null) {
      server.listen(port, resolve);
    } else {
      server.listen(port, hostname, resolve);
    }
  });
}

async function handleClose(server: http.Server | https.Server) {
  await new Promise(resolve => server.close(resolve));
}
