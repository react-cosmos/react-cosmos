import { RawCosmosConfig, CosmosConfig } from '../../config';

type RawDomCosmosConfig = RawCosmosConfig & {
  dom?: {
    containerQuerySelector?: string;
  };
  webpack?: {
    configPath?: string;
    hotReload?: boolean;
  };
};

export class WebpackCosmosConfig extends CosmosConfig<RawDomCosmosConfig> {
  get containerQuerySelector() {
    const { dom = {} } = this.getRawConfig();
    return this.default<null | string>(dom.containerQuerySelector, null);
  }

  get webpackConfigPath() {
    // TODO: Throw if config path is defined and invalid
    const { webpack = {} } = this.getRawConfig();
    const webpackConfigPath = this.default<string>(
      webpack.configPath,
      'webpack.config.js'
    );
    return webpackConfigPath && this.resolvePath(webpackConfigPath);
  }

  get hotReload() {
    const { webpack = {} } = this.getRawConfig();
    return this.default<boolean>(webpack.hotReload, true);
  }
}
