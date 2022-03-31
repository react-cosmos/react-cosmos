import { PluginContext } from 'react-plugin';
import { RendererPreviewSpec } from '../../../ui/specs/RendererPreviewSpec';

export type UrlStatus = 'unknown' | 'ok' | 'error';
export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type State = {
  urlStatus: UrlStatus;
  runtimeStatus: RuntimeStatus;
};

export type RendererPreviewContext = PluginContext<RendererPreviewSpec>;
