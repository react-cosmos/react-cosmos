// @flow

import type { FixtureState } from './fixture-state';

// NOTE: Renderer ids are self assigned in remote environments, so uniqueness
// cannot be established by consensus
export type RendererId = string;

export type FixtureNames = Array<string>;

// Announce a new renderer or refresh a renderer's fixture data
export type RendererReadyMsg = {
  type: 'rendererReady',
  payload: {
    rendererId: RendererId,
    fixtures: FixtureNames
  }
};

// Announce an error caught inside a renderer, which is useful when the
// renderer isn't visible or if it errors before dispatching `rendererReady`
export type RendererErrorMsg = {
  type: 'rendererError',
  payload: {
    rendererId: RendererId
    // TODO: Including error payload might be useful for remotes which aren't
    // running alongside renderers (eg. Browser UI with React Native renderer)
  }
};

// Announce a new remote (eg. Cosmos UI), essentially requesting a
// `rendererReady` event from running renderers
export type RemoteReadyMsg = {
  type: 'remoteReady'
};

// Ask a remote renderer to load a fixture
export type SelectFixtureMsg = {
  type: 'selectFixture',
  payload: {
    rendererId: RendererId,
    fixturePath: string
  }
};

// Ask a remote renderer to alter its fixture state
export type SetFixtureStateMsg = {
  type: 'setFixtureState',
  payload: {
    rendererId: RendererId,
    // Only one fixture can be loaded at a time by a renderer, but the path is
    // sent anyway to ensure the message applies to the current fixture
    fixturePath: string,
    fixtureState: $Shape<FixtureState>
  }
};

// Confirmation that a fixture state changed has been applied by a renderer
export type FixtureStateChangeMsg = {
  type: 'fixtureStateChange',
  payload: {
    rendererId: RendererId,
    // Only one fixture can be loaded at a time by a renderer, but the path is
    // sent anyway to ensure the message applies to the current fixture
    fixturePath: string,
    // Entire fixture state is included
    fixtureState: FixtureState
  }
};

export type RenderMessage =
  | RendererReadyMsg
  | RendererErrorMsg
  | RemoteReadyMsg
  | SelectFixtureMsg
  | SetFixtureStateMsg
  | FixtureStateChangeMsg;
