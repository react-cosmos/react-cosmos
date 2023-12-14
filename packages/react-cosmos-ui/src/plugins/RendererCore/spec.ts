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
    getFixtureState(): FixtureState;
    getFixtureStateByName<T>(name: string): T | undefined;
    isRendererConnected(): boolean;
    reloadRenderer(): void;
    setFixtureState(stateUpdater: StateUpdater<FixtureState>): void;
    setGlobalFixtureState<T>(name: string, state: T): void;
    selectPrimaryRenderer(primaryRendererId: RendererId): void;
    receiveResponse(msg: MessageType): void;
  };
  events: {
    request(msg: MessageType): void;
    response(msg: MessageType): void;
  };
};
