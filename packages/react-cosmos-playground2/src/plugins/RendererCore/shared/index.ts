import { RendererCoreSpec } from 'react-cosmos-shared2/ui';
import { PluginContext } from 'react-plugin';

export type State = RendererCoreSpec['state'];

export type RendererCoreContext = PluginContext<RendererCoreSpec>;
