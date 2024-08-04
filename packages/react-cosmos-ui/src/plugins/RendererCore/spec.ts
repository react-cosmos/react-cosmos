import {
  FixtureList,
  FixtureState,
  FixtureStateChange,
  MessageType,
  RendererId,
} from 'react-cosmos-core';

export type GetFixtureState = <T>(name: string) => T | undefined;

// The type name is verbose to avoid confusion with SetFixtureState
// from react-cosmos-core package
export type SetFixtureStateByName = <T>(
  name: string,
  change: FixtureStateChange<T>
) => void;

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
    isRendererConnected(): boolean;
    reloadRenderer(): void;
    selectPrimaryRenderer(primaryRendererId: RendererId): void;
    receiveResponse(msg: MessageType): void;
    getAllFixtureState(): FixtureState;
    getFixtureState: GetFixtureState;
    setFixtureState: SetFixtureStateByName;
    setGlobalFixtureState<T>(name: string, state: T): void;
  };
  events: {
    request(msg: MessageType): void;
    response(msg: MessageType): void;
  };
};
