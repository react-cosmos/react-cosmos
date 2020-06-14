import http, { Server } from 'http';
import https from 'https';
import fs from 'fs';
const pem = require('pem');
import { CosmosConfig } from '../../config';

type RequestListener = (
  request: http.IncomingMessage,
  response: http.ServerResponse
) => void;

export async function createHttpServer(
  cosmosConfig: CosmosConfig,
  requestListener: RequestListener
) {
  const {
    port,
    hostname,
    https: httpsEnabled,
    httpsKeyPath,
    httpsCertPath,
  } = cosmosConfig;

  let server: Server;
  if (httpsEnabled) {
    let credentials: {
      key: string;
      cert: string;
    };

    if (httpsKeyPath && httpsCertPath) {
      credentials = {
        key: fs.readFileSync(httpsKeyPath, 'utf8'),
        cert: fs.readFileSync(httpsCertPath, 'utf8'),
      };
    } else {
      credentials = await new Promise((resolve, reject) => {
        pem.createCertificate(
          {
            days: 1000,
            selfSigned: true,
          },
          (
            err: Error,
            keys: {
              serviceKey: string;
              certificate: string;
            }
          ) => {
            if (err) {
              return reject(err);
            }
            return resolve({
              key: keys.serviceKey,
              cert: keys.certificate,
            });
          }
        );
      });
    }

    server = https.createServer(credentials, requestListener);
  } else {
    server = http.createServer(requestListener);
  }

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
