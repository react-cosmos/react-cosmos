import { PluginContext } from 'react-plugin';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { Viewport } from '../public';

export type StorageMock = { [key: string]: any };

export interface IFixtureStateWithViewport extends FixtureState {
  viewport?: Viewport;
}

export type SetFixtureStateHandler = (
  context: PluginContext<RendererCoordinatorSpec>,
  stateChange: StateUpdater<null | FixtureState>
) => void;
