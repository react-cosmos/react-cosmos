import { PluginContext } from 'react-plugin';
import { RendererCoreSpec } from '../spec';

export type State = RendererCoreSpec['state'];

export type RendererCoreContext = PluginContext<RendererCoreSpec>;
