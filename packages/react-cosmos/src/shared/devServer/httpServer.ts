import fs from 'fs';
import http from 'http';
import https from 'https';
import pem from 'pem';
import { CosmosConfig } from '../../config';

type RequestListener = (
  request: http.IncomingMessage,
  response: http.ServerResponse
) => void;

export async function createHttpServer(
  cosmosConfig: CosmosConfig,
  requestListener: RequestListener
) {
  const { port, hostname, https: httpsEnabled } = cosmosConfig;

  const server = httpsEnabled
    ? https.createServer(await getHttpsOpts(cosmosConfig), requestListener)
    : http.createServer(requestListener);

  async function start() {
    await new Promise(resolve => {
      if (hostname === null) {
        server.listen(port, resolve);
      } else {
        server.listen(port, hostname, resolve);
      }
    });

    const hostnameDisplay = hostname || 'localhost';
    const protocol = httpsEnabled ? 'https' : 'http';
    console.log(`[Cosmos] See you at ${protocol}://${hostnameDisplay}:${port}`);
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

  return await new Promise((resolve, reject) => {
    pem.createCertificate({ days: 1000, selfSigned: true }, (err, keys) => {
      if (err) return reject(err);
      return resolve({ key: keys.serviceKey, cert: keys.certificate });
    });
  });
}
