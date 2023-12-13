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
    rendererUrl: null | string;
  };
  state: {
    connectedRendererIds: RendererId[];
    primaryRendererId: null | RendererId;
    fixtures: FixtureList;
    fixtureState: FixtureState;
    globalFixtureState: FixtureState;
  };
  methods: {
    getRendererUrl(): null | string;
    getConnectedRendererIds(): RendererId[];
    getPrimaryRendererId(): null | RendererId;
    getFixtures(): FixtureList;
    getFixtureState<T extends object = {}>(): FixtureState & T;
    isRendererConnected(): boolean;
    reloadRenderer(): void;
    setFixtureState(stateUpdater: StateUpdater<FixtureState>): void;
    setGlobalFixtureState(newState: FixtureState): void;
    selectPrimaryRenderer(primaryRendererId: RendererId): void;
    receiveResponse(msg: MessageType): void;
  };
  events: {
    request(msg: MessageType): void;
    response(msg: MessageType): void;
  };
};
