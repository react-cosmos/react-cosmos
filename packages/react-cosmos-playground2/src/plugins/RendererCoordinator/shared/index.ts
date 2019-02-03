import { IPluginContext } from 'react-plugin';
import { RendererCoordinatorSpec } from '../public';

export type State = RendererCoordinatorSpec['state'];

export type Context = IPluginContext<RendererCoordinatorSpec>;
