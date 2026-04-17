import type { PluginContext } from 'react-plugin';
import type { RendererCoreSpec } from '../spec.js';

export type State = RendererCoreSpec['state'];

export type RendererCoreContext = PluginContext<RendererCoreSpec>;
