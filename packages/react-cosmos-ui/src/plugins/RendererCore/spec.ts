import {
  FixtureList,
  FixtureState,
  MessageType,
  RendererId,
  StateUpdater,
} from 'react-cosmos-core';

export type RendererCoreSpec = {
  name: 'rendererCore';
  config: {
    fixtures: FixtureList;
  };
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
