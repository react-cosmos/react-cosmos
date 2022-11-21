import { FixtureState, StateUpdater } from 'react-cosmos-core';
import { PluginContext } from 'react-plugin';
import { RendererCoreSpec } from '../../RendererCore/spec.js';

export type StorageMock = { [key: string]: any };

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoreSpec>,
  stateUpdater: StateUpdater<FixtureState>
) => void;
