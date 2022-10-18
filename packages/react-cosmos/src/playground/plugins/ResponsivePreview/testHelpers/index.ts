import { PluginContext } from 'react-plugin';
import { FixtureState } from 'react-cosmos-core/fixtureState';
import { StateUpdater } from 'react-cosmos-core/utils';
import { RendererCoreSpec } from '../../RendererCore/spec.js';

export type StorageMock = { [key: string]: any };

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoreSpec>,
  stateUpdater: StateUpdater<FixtureState>
) => void;
