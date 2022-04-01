import { PluginContext } from 'react-plugin';
import { FixtureState } from '../../../../core/fixtureState/types.js';
import { StateUpdater } from '../../../../utils/types.js';
import { RendererCoreSpec } from '../../RendererCore/spec.js';

export type StorageMock = { [key: string]: any };

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoreSpec>,
  stateUpdater: StateUpdater<FixtureState>
) => void;
