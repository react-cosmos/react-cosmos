import path from 'node:path';
import {
  CosmosConfig,
  fileExists,
  moduleExists,
  resolveLoose,
} from 'react-cosmos';

export type CosmosViteConfig = {
  configPath: string | false;
  indexPath: string | null;
  port: number;
};

type CosmosViteConfigInput = Partial<CosmosViteConfig>;

export function createCosmosViteConfig(
  cosmosConfig: CosmosConfig
): CosmosViteConfig {
  const { rootDir } = cosmosConfig;
  const configInput: CosmosViteConfigInput = cosmosConfig.vite || {};

  const configPath = getViteConfigPath(configInput, rootDir);
  logViteConfigInfo(configPath);

  return {
    configPath,

    indexPath: configInput.indexPath
      ? resolveLoose(rootDir, configInput.indexPath)
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
    const defaultAbsPath = resolveLoose(rootDir, 'vite.config.js');
    return moduleExists(defaultAbsPath) ? defaultAbsPath : false;
  }

  const absPath = resolveLoose(rootDir, configPath);
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
