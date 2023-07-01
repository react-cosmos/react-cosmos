// TODO: Validate config schema on config import
// Maybe: Allow `build` and `ui` values to be [true] for default paths?
export type RawCosmosPluginConfig = {
  name: string;
  build?: string;
  ui?: string;
};

export type CosmosPluginConfig = {
  name: string;
  rootDir: string;
  build?: string;
  ui?: string;
};

export type UiCosmosPluginConfig = CosmosPluginConfig & {
  ui: string;
};
