import express from 'express';
import path from 'path';
import { removeLeadingDot } from 'react-cosmos-core';

export function getStaticPath(relPath: string) {
  return path.join(__dirname, '../static', relPath);
}

export function serveStaticDir(
  app: express.Application,
  staticPath: string,
  publicUrl: string
) {
  const relStaticPath = path.relative(process.cwd(), staticPath);
  console.log(`[Cosmos] Serving static files from ${relStaticPath}`);

  app.use(
    removeLeadingDot(publicUrl),
    express.static(staticPath, {
      // Ensure Playground index loads instead an index.html found in the
      // static path
      index: false,
    })
  );
}
