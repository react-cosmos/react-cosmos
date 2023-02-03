import express from 'express';
import { MessageType } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';

export type PlatformType = 'web' | 'native';

export type DevServerPluginArgs = {
  cosmosConfig: CosmosConfig;
  platformType: PlatformType;
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
