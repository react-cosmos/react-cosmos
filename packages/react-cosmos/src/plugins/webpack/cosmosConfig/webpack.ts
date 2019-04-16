import { CosmosConfig, resolvePath } from '../../../config';

type WebpackCosmosConfig = {
  configPath: null | string;
  hotReload: boolean;
};

type WebpackCosmosConfigInput = Partial<WebpackCosmosConfig>;

export function createWebpackCosmosConfig(
  cosmosConfig: CosmosConfig
): WebpackCosmosConfig {
  const { rootDir } = cosmosConfig;
  const webpackCosmosConfigInput = (cosmosConfig.webpack ||
    {}) as WebpackCosmosConfigInput;
  return {
    configPath: getWebpackConfigPath(webpackCosmosConfigInput, rootDir),
    hotReload: getHotReload(webpackCosmosConfigInput)
  };
}

function getWebpackConfigPath(
  { configPath = 'webpack.config.js' }: WebpackCosmosConfigInput,
  rootDir: string
) {
  return configPath && resolvePath(rootDir, configPath);
}

function getHotReload({ hotReload = true }: WebpackCosmosConfigInput) {
  return hotReload;
}
