import { PartialCosmosPluginConfig } from 'react-cosmos-core';
import { CoreSpec } from './plugins/Core/spec';

// Config can also contain keys for 3rd party plugins
export type PlaygroundConfig = {
  core: CoreSpec['config'];
  [pluginName: string]: {};
};

export type PlaygroundMountArgs = {
  playgroundConfig: PlaygroundConfig;
  pluginConfigs: PartialCosmosPluginConfig[];
};
