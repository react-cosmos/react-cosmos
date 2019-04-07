import fs from 'fs';
import path from 'path';
import open from 'open';
import express from 'express';
import { DevServerPluginArgs } from '../shared';

export function openFile({ cosmosConfig, expressApp }: DevServerPluginArgs) {
  expressApp.get('/_open', (req: express.Request, res: express.Response) => {
    const relPath = req.query.filePath;
    if (typeof relPath !== 'string') {
      throw new Error(`Invalid path: ${String(relPath)}`);
    }

    const absPath = path.join(cosmosConfig.rootDir, relPath);
    if (!fs.existsSync(absPath)) {
      res.status(404).send(`File not found at path: ${absPath}`);
      return;
    }

    open(absPath);
    res.send();
  });
}
