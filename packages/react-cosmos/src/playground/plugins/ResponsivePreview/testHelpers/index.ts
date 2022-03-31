import { PluginContext } from 'react-plugin';
import { RendererCoreSpec } from '../../../../ui/specs/RendererCoreSpec';
import { FixtureState } from '../../../../utils/fixtureState/types';
import { StateUpdater } from '../../../../utils/state';

export type StorageMock = { [key: string]: any };

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoreSpec>,
  stateUpdater: StateUpdater<FixtureState>
) => void;
