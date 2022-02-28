import express from 'express';
import http from 'http';
import { Message } from 'react-cosmos-shared2/util';
import { CosmosConfig } from '../config/shared';

export type PlatformType = 'web' | 'native';

export type DevServerPluginArgs = {
  cosmosConfig: CosmosConfig;
  platformType: PlatformType;
  httpServer: http.Server;
  expressApp: express.Express;
  sendMessage(msg: Message): unknown;
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
