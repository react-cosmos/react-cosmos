import path from 'node:path';
import type { CosmosConfig } from 'react-cosmos';
import { fileExists, resolveFromSilent } from 'react-cosmos';

export type CosmosViteConfig = {
  configPath: string | false;
  mainScriptUrl: string | null;
  // The renderer is served by the Cosmos server unless a port is set, in which
  // case Vite starts its own server on that port
  port: number | null;
};

type CosmosViteConfigInput = Partial<CosmosViteConfig>;

export function createCosmosViteConfig(config: CosmosConfig): CosmosViteConfig {
  const { rootDir } = config;
  const configInput: CosmosViteConfigInput = config.vite || {};

  const configPath = getViteConfigPath(configInput, rootDir);
  logViteConfigInfo(configPath);

  return {
    configPath,
    mainScriptUrl: configInput.mainScriptUrl ?? null,
    port: getCosmosVitePort(config),
  };
}

export function getCosmosVitePort(config: CosmosConfig) {
  const configInput: CosmosViteConfigInput = config.vite || {};
  return configInput.port ?? null;
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
    console.log(`[Cosmos] Using Vite config found at ${relPath}`);
  } else {
    console.log(`[Cosmos] No Vite config found, using default settings`);
  }
}
