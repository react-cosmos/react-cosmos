// TODO: Validate config schema on config import
// TODO: Allow ui and devServer to be [true] for default paths?
export type RawCosmosPluginConfig = {
  name: string;
  ui?: string;
  server?: string;
};

export type CosmosPluginConfig = {
  name: string;
  rootDir: string;
  ui?: string;
  server?: string;
};

export type UiCosmosPluginConfig = CosmosPluginConfig & {
  ui: string;
};
