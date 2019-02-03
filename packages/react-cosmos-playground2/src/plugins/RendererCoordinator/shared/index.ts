import { IPluginContext } from 'react-plugin';
import { RendererCoordinatorSpec } from '../spec';

export type RendererCoordinatorState = RendererCoordinatorSpec['state'];

export type RendererCoordinatorContext = IPluginContext<
  RendererCoordinatorSpec
>;
