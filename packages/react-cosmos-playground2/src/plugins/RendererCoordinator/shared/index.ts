import { PluginContext } from 'react-plugin';
import { RendererCoordinatorSpec } from '../public';

export type State = RendererCoordinatorSpec['state'];

export type Context = PluginContext<RendererCoordinatorSpec>;
