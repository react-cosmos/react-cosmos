// TODO: Validate config schema on config import
// TODO: Allow ui and devServer to be [true] for default paths?
export type RawCosmosPluginConfig = {
  name: string;
  ui?: string;
  devServer?: string;
  export?: string;
};

export type CosmosPluginConfig = {
  name: string;
  rootDir: string;
  ui?: string;
  devServer?: string;
  export?: string;
};

export type UiCosmosPluginConfig = CosmosPluginConfig & {
  ui: string;
};
