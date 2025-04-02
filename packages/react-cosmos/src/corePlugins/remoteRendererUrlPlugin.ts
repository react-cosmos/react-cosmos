import express from 'express';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { getRemoteRendererUrl } from '../shared/remoteRendererUrl.js';

export const remoteRendererUrlPlugin: CosmosServerPlugin = {
  name: 'remoteRendererUrlPlugin',

  devServer({ cosmosConfig, app }) {
    app.get(
      '/_cosmos/remote-renderer-url',
      (req: express.Request, res: express.Response) => {
        res.send({ url: getRemoteRendererUrl(cosmosConfig) });
      }
    );
  },
};
