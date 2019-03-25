// @flow

import path from 'path';
import opn from 'opn';

import type { Config } from 'react-cosmos-flow/config';

type PluginArgs = {
  app: express$Application,
  cosmosConfig: Config
};

export default function openFile({ app, cosmosConfig }: PluginArgs) {
  app.get('/_open', (req: express$Request, res: express$Response) => {
    const relPath = req.query.filePath;
    if (typeof relPath !== 'string') {
      throw new Error(`Invalid path: ${String(relPath)}`);
    }

    const absPath = path.join(cosmosConfig.rootPath, relPath);
    opn(absPath);

    res.send();
  });
}
