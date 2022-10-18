import { FixtureState } from 'react-cosmos-core/fixtureState';
import { FixtureList } from 'react-cosmos-core/fixture';
import { RendererId } from 'react-cosmos-core/renderer';
import { MessageType, StateUpdater } from 'react-cosmos-core/utils';

export type RendererCoreSpec = {
  name: 'rendererCore';
  state: {
    connectedRendererIds: RendererId[];
    primaryRendererId: null | RendererId;
    fixtures: FixtureList;
    fixtureState: FixtureState;
  };
  methods: {
    getConnectedRendererIds(): RendererId[];
    getPrimaryRendererId(): null | RendererId;
    getFixtures(): FixtureList;
    getFixtureState(): FixtureState;
    isRendererConnected(): boolean;
    isValidFixtureSelected(): boolean;
    setFixtureState(stateUpdater: StateUpdater<FixtureState>): void;
    selectPrimaryRenderer(primaryRendererId: RendererId): void;
    receiveResponse(msg: MessageType): void;
  };
  events: {
    request(msg: MessageType): void;
    response(msg: MessageType): void;
  };
};
