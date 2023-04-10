import express from 'express';
import path from 'node:path';
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

        // Paths are absolute with the dev server, and relative with static
        // exports. Why aren't they always relative? Because in dev mode
        // the plugins could be loaded from folders outside the project rootDir,
        // for example when using a monorepo. In that case relative paths would
        // have to contain "../" segments, which are not allowed in URLs, and
        // for this reason we pass full paths when using the dev server.
        const resolvedPath = resolveSilent(
          // Windows paths don't start with a slash (e.g. C:\foo\bar.js)
          path.isAbsolute(moduleId) ? moduleId : `/${moduleId}`
        );

        if (!resolvedPath) {
          res.sendStatus(404);
          return;
        }

        res.sendFile(resolvedPath);
      }
    );
  },
};
