import fs from 'fs';
import http from 'http';
import https from 'https';
import pem from 'pem';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPlaygroundUrl } from '../shared/playgroundUrl.js';

type RequestListener = (
  request: http.IncomingMessage,
  response: http.ServerResponse
) => void;

export async function createHttpServer(
  config: CosmosConfig,
  requestListener: RequestListener
) {
  const server = config.https
    ? https.createServer(await getHttpsOpts(config), requestListener)
    : http.createServer(requestListener);

  async function start() {
    await new Promise<void>(resolve => {
      if (config.host === null) {
        server.listen(config.port, resolve);
      } else {
        server.listen(config.port, config.host, resolve);
      }
    });

    console.log(`[Cosmos] See you at ${getPlaygroundUrl(config)}`);
  }

  async function stop() {
    await new Promise(resolve => server.close(resolve));
  }

  return { server, start, stop };
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
