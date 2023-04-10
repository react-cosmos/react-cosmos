import express from 'express';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { resolveSilent } from '../utils/resolveSilent.js';

export const pluginEndpointServerPlugin: CosmosServerPlugin = {
  name: 'pluginEndpoint',

  devServer({ cosmosConfig, expressApp }) {
    expressApp.get(
      '/_plugin/*.js',
      (req: express.Request, res: express.Response) => {
        const moduleId = req.params['0'];

        if (!moduleId) {
          res.sendStatus(404);
          return;
        }

        const resolvedPath = resolveSilent(`/${moduleId}`);

        if (!resolvedPath) {
          res.sendStatus(404);
          return;
        }

        res.sendFile(resolvedPath);
      }
    );
  },
};
