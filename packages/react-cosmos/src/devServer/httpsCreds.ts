import fs from 'fs';
import pem from 'pem';
import { CosmosConfig } from '../cosmosConfig/types.js';

type HttpsCreds = { key: string; cert: string };

let _cache: HttpsCreds | undefined;

export async function getHttpsCreds(config: CosmosConfig): Promise<HttpsCreds> {
  const { httpsOptions } = config;
  if (httpsOptions)
    return {
      key: fs.readFileSync(httpsOptions.keyPath, 'utf8'),
      cert: fs.readFileSync(httpsOptions.certPath, 'utf8'),
    };

  if (_cache) return _cache;

  console.log('[Cosmos] Generating HTTPS certificate');
  return await new Promise((resolve, reject) => {
    pem.createCertificate({ days: 1000, selfSigned: true }, (err, keys) => {
      if (err) reject(err);
      else {
        _cache = { key: keys.serviceKey, cert: keys.certificate };
        resolve(_cache);
      }
    });
  });
}
