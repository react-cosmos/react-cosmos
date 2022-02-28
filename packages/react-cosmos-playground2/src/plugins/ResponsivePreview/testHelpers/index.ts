import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererCoreSpec } from 'react-cosmos-shared2/ui';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { PluginContext } from 'react-plugin';

export type StorageMock = { [key: string]: any };

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoreSpec>,
  stateUpdater: StateUpdater<FixtureState>
) => void;
