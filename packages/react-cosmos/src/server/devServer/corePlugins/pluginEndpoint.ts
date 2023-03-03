import express from 'express';
import { DevServerPluginArgs } from '../../cosmosPlugin/types.js';
import { resolveFromSilent, resolveSilent } from '../../utils/resolveSilent.js';

export default function pluginEndpointDevServerPlugin({
  cosmosConfig,
  expressApp,
}: DevServerPluginArgs) {
  expressApp.get(
    '/_plugin/*.js',
    (req: express.Request, res: express.Response) => {
      const moduleId = req.params['0'];

      if (!moduleId) {
        res.sendStatus(404);
        return;
      }

      const resolvedPath =
        resolveSilent(`/${moduleId}`) ||
        resolveFromSilent(cosmosConfig.rootDir, moduleId);

      if (!resolvedPath) {
        res.sendStatus(404);
        return;
      }

      res.sendFile(resolvedPath);
    }
  );
}
