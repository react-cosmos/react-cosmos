// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';

import type { Node } from 'react';
import type {
  RendererResponse,
  FixtureListMsg,
  FixtureStateMsg
} from 'react-cosmos-shared2/renderer';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { RendererState } from './shared';

type Props = {
  children: Node
};

export class RendererResponseHandler extends Component<Props> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  render() {
    return this.props.children;
  }

  getOwnState(): RendererState {
    return this.context.state.renderer;
  }

  setOwnState(state: RendererState) {
    this.context.setState('renderer', state);
  }

  removeRendererResponseListener = () => {};

  componentDidMount() {
    this.removeRendererResponseListener = this.context.addEventListener(
      'renderer.onResponse',
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
      case 'fixtureState':
        return this.handleFixtureStateResponse(msg);
      default:
      // No need to handle every message. Maybe some plugin cares about it.
    }
  };

  handleFixtureListResponse({ payload }: FixtureListMsg) {
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

  handleFixtureStateResponse({ payload }: FixtureStateMsg) {
    const { fixtureState } = payload;
    const state = this.getOwnState();

    this.setOwnState({
      ...state,
      fixtureState
    });
  }
}
