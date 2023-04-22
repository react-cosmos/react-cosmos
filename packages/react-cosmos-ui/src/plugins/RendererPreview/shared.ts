import { PluginContext } from 'react-plugin';
import { RendererPreviewSpec, RuntimeStatus, UrlStatus } from './spec.js';

export type State = {
  urlStatus: UrlStatus;
  runtimeStatus: RuntimeStatus;
};

export type RendererPreviewContext = PluginContext<RendererPreviewSpec>;
