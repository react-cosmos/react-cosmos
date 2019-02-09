import { PluginContext } from 'react-plugin';
import { RendererPreviewSpec } from './public';

export type UrlStatus = 'unknown' | 'ok' | 'error';
export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type State = {
  urlStatus: UrlStatus;
  runtimeStatus: RuntimeStatus;
};

export type Context = PluginContext<RendererPreviewSpec>;
