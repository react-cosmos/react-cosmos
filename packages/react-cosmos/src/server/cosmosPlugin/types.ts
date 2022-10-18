import express from 'express';
import http from 'http';
import { MessageType } from 'react-cosmos-core/utils';
import { CosmosConfig } from '../cosmosConfig/types';

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

export type PlatformType = 'web' | 'native';

export type DevServerPluginArgs = {
  cosmosConfig: CosmosConfig;
  platformType: PlatformType;
  httpServer: http.Server;
  expressApp: express.Express;
  sendMessage(msg: MessageType): unknown;
};

export type DevServerPluginCleanupCallback = () => unknown;

export type DevServerPluginReturnValue =
  void | null | DevServerPluginCleanupCallback;

export type DevServerPluginReturn =
  | DevServerPluginReturnValue
  | Promise<DevServerPluginReturnValue>;

export type DevServerPlugin = (
  args: DevServerPluginArgs
) => DevServerPluginReturn;

export type ExportPluginArgs = {
  cosmosConfig: CosmosConfig;
};

export type ExportPlugin = (args: ExportPluginArgs) => unknown;
