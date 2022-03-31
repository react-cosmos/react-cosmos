import { PluginContext } from 'react-plugin';
import { RendererCoreSpec } from '../../../../ui/specs/RendererCoreSpec';

export type State = RendererCoreSpec['state'];

export type RendererCoreContext = PluginContext<RendererCoreSpec>;
