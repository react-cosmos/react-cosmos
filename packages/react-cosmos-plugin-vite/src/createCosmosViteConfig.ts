import path from 'node:path';
import { CosmosConfig, fileExists, resolveFromSilent } from 'react-cosmos';

export type CosmosViteConfig = {
  configPath: string | false;
  indexPath: string | null;
  port: number;
};

type CosmosViteConfigInput = Partial<CosmosViteConfig>;

export function createCosmosViteConfig(config: CosmosConfig): CosmosViteConfig {
  const { rootDir } = config;
  const configInput: CosmosViteConfigInput = config.vite || {};

  const configPath = getViteConfigPath(configInput, rootDir);
  // FIXME: Log this only once!
  logViteConfigInfo(configPath);

  return {
    configPath,

    indexPath: configInput.indexPath
      ? path.join(rootDir, configInput.indexPath)
      : null,

    port: getCosmosVitePort(configInput),
  };
}

export function getCosmosVitePort(cosmosViteConfig: CosmosViteConfigInput) {
  const { port = 5050 } = cosmosViteConfig;
  return port;
}

function getViteConfigPath(
  { configPath }: CosmosViteConfigInput,
  rootDir: string
) {
  // User can choose to prevent automatical use of an existing vite.config.js
  // file (relative to the root dir) by setting configPath to false
  if (configPath === false) {
    return false;
  }

  if (typeof configPath == 'undefined') {
    return (
      resolveFromSilent(rootDir, './vite.config.ts') ||
      resolveFromSilent(rootDir, './vite.config.js') ||
      false
    );
  }

  const absPath = path.join(rootDir, configPath);
  if (!fileExists(absPath)) {
    const relPath = path.relative(process.cwd(), absPath);
    throw new Error(`Vite config not found at path: ${relPath}`);
  }

  return absPath;
}

function logViteConfigInfo(viteConfigPath: string | false) {
  if (viteConfigPath) {
    const relPath = path.relative(process.cwd(), viteConfigPath);
    console.log(`[Cosmos] Using vite config found at ${relPath}`);
  } else {
    console.log(`[Cosmos] No vite config found, using default settings`);
  }
}
