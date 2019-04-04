import * as path from 'path';
import open from 'open';
import * as express from 'express';
import { CosmosConfig, getRootDir } from '../../shared/config';

type PluginArgs = {
  cosmosConfig: CosmosConfig;
  app: express.Application;
};

export default function openFile({ app, cosmosConfig }: PluginArgs) {
  app.get('/_open', (req: express.Request, res: express.Response) => {
    const relPath = req.query.filePath;
    if (typeof relPath !== 'string') {
      throw new Error(`Invalid path: ${String(relPath)}`);
    }

    const absPath = path.join(getRootDir(cosmosConfig), relPath);
    open(absPath);

    res.send();
  });
}
