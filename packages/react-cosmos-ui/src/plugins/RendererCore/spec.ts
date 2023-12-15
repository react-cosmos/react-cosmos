import {
  FixtureList,
  FixtureState,
  HybridStateChange,
  MessageType,
  RendererId,
} from 'react-cosmos-core';

export type GetFixtureState = <T>(name: string) => T | undefined;

// The type name is verbose to avoid confusion with SetFixtureState
// from react-cosmos-core package
export type SetFixtureStateByName = <T>(
  name: string,
  change: HybridStateChange<T | undefined>
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
    // TODO: Remove getFixtureState and in favor of getFixtureStateByName, or
    // use it only where necessary, possibly rename it to getEntireFixtureState
    getFixtureState(): FixtureState;
    getFixtureStateByName: GetFixtureState;
    setFixtureState: SetFixtureStateByName;
    setGlobalFixtureState<T>(name: string, state: T): void;
  };
  events: {
    request(msg: MessageType): void;
    response(msg: MessageType): void;
  };
};
