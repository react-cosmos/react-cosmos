import { Request, Response } from 'express';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { getRemoteRendererUrl } from '../shared/remoteRendererUrl.js';

export const remoteRendererUrlPlugin: CosmosServerPlugin = {
  name: 'remoteRendererUrlPlugin',

  devServer({ config, app }) {
    app.get('/_cosmos/remote-renderer-url', (_: Request, res: Response) => {
      res.send({ url: getRemoteRendererUrl(config) });
    });
  },
};
