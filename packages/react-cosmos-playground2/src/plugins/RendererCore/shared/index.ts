import { PluginContext } from 'react-plugin';
import { RendererCoreSpec } from '../public';

export type State = RendererCoreSpec['state'];

export type Context = PluginContext<RendererCoreSpec>;
