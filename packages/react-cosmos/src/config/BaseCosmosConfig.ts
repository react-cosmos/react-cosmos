import { RawCosmosConfig } from './shared';

export class BaseCosmosConfig<RawConfig extends RawCosmosConfig> {
  private rawConfig: RawConfig;

  constructor(rawConfig: RawConfig) {
    this.rawConfig = rawConfig;
  }

  getRawConfig(): RawConfig {
    return this.rawConfig;
  }

  protected default<T>(rawValue: void | T, defaultValue: T): T {
    return typeof rawValue === 'undefined' ? defaultValue : rawValue;
  }
}
