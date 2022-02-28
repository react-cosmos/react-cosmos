import { RendererPreviewSpec } from 'react-cosmos-shared2/ui';
import { PluginContext } from 'react-plugin';

export type UrlStatus = 'unknown' | 'ok' | 'error';
export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type State = {
  urlStatus: UrlStatus;
  runtimeStatus: RuntimeStatus;
};

export type RendererPreviewContext = PluginContext<RendererPreviewSpec>;
