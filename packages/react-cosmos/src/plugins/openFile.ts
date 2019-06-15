import fs from 'fs';
import path from 'path';
import launchEditor from 'launch-editor';
import express from 'express';
import { CosmosConfig } from '../config/shared';
import { DevServerPluginArgs } from '../shared/devServer';

type ReqQuery = { filePath: void | string; line: number; column: number };

export function openFile({ cosmosConfig, expressApp }: DevServerPluginArgs) {
  expressApp.get('/_open', (req: express.Request, res: express.Response) => {
    const { filePath, line, column } = getReqQuery(req);
    if (!filePath) {
      res.status(400).send(`File path missing`);
      return;
    }

    const absFilePath = resolveFilePath(cosmosConfig, filePath);
    if (!fs.existsSync(absFilePath)) {
      res.status(404).send(`File not found at path: ${absFilePath}`);
      return;
    }

    new Promise((resolve, reject) => {
      const file = `${absFilePath}:${line}:${column}`;
      launchEditor(file, (fileName, errorMsg) => reject(errorMsg));
      // If launchEditor doesn't report error within 500ms we assume it worked
      setTimeout(resolve, 500);
    })
      .then(() => res.send())
      .catch(err => {
        res.status(500).send('Failed to open file');
      });
  });
}

function getReqQuery(req: express.Request): ReqQuery {
  const filePath = req.query.filePath;
  const line = req.query.line ? parseInt(req.query.line, 10) : 1;
  const column = req.query.column ? parseInt(req.query.column, 10) : 1;
  return { filePath, line, column };
}

function resolveFilePath(cosmosConfig: CosmosConfig, filePath: string) {
  // This heuristic is needed because the open file endpoint is used for
  // multiple applications, which provide different file path types:
  // 1. Edit fixture button: Sends path relative to Cosmos rootDir
  // 2. react-error-overlay runtime error: Sends absolute path
  // 3. react-error-overlay compile error: Sends path relative to CWD
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  const cosmosRelPath = path.join(cosmosConfig.rootDir, filePath);
  const cwdRelPath = path.join(process.cwd(), filePath);
  return fs.existsSync(cosmosRelPath) ? cosmosRelPath : cwdRelPath;
}
