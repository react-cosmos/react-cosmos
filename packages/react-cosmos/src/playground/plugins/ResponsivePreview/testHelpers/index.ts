import { PluginContext } from 'react-plugin';
import { FixtureState } from '../../../../core/fixtureState/types';
import { StateUpdater } from '../../../../utils/types';
import { RendererCoreSpec } from '../../RendererCore/spec';

export type StorageMock = { [key: string]: any };

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoreSpec>,
  stateUpdater: StateUpdater<FixtureState>
) => void;
