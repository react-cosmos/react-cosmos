// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';

import type {
  RendererResponse,
  FixtureListResponse,
  FixtureStateChangeResponse
} from 'react-cosmos-shared2/renderer';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { RendererState } from './shared';

export class RendererResponseHandler extends Component<{}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  render() {
    return null;
  }

  getOwnState(): RendererState {
    return this.context.getState('renderer');
  }

  setOwnState(state: RendererState) {
    this.context.setState('renderer', state);
  }

  removeRendererResponseListener = () => {};

  componentDidMount() {
    this.removeRendererResponseListener = this.context.addEventListener(
      'renderer.response',
      this.handleRendererResponse
    );
  }

  componentWillUnmount() {
    this.removeRendererResponseListener();
  }

  handleRendererResponse = (msg: RendererResponse) => {
    switch (msg.type) {
      case 'fixtureList':
        return this.handleFixtureListResponse(msg);
      case 'fixtureStateChange':
        return this.handleFixtureStateResponse(msg);
      default:
      // No need to handle every message. Maybe some plugin cares about it.
    }
  };

  handleFixtureListResponse({ payload }: FixtureListResponse) {
    const { rendererId, fixtures } = payload;
    const state = this.getOwnState();
    const { rendererIds } = state;

    this.setOwnState({
      ...state,
      rendererIds:
        rendererIds.indexOf(rendererId) === -1
          ? [...rendererIds, rendererId]
          : rendererIds,
      fixtures
    });
  }

  handleFixtureStateResponse({ payload }: FixtureStateChangeResponse) {
    const { fixtureState } = payload;
    const state = this.getOwnState();

    this.setOwnState({
      ...state,
      fixtureState
    });
  }
}
