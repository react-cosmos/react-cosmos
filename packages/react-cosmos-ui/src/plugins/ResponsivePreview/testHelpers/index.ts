import type { FixtureState, StateUpdater } from 'react-cosmos-core';
import type { PluginContext } from 'react-plugin';
import type { RendererCoreSpec } from '../../RendererCore/spec.js';

export type StorageMock = { [key: string]: any };

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoreSpec>,
  stateUpdater: StateUpdater<FixtureState>
) => void;
