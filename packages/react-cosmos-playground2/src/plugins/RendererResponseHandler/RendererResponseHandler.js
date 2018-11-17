// @flow

import { Component } from 'react';
import { isEqual } from 'lodash';
import { PlaygroundContext } from '../../PlaygroundContext';

import type {
  RendererId,
  RendererResponse,
  FixtureListResponse,
  FixtureStateChangeResponse,
  FixtureStateSyncResponse
} from 'react-cosmos-shared2/renderer';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { UrlParams } from '../Router';
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

  setOwnState(state: RendererState, cb?: Function) {
    this.context.setState('renderer', state, cb);
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
        return this.handleFixtureStateChangeResponse(msg);
      case 'fixtureStateSync':
        return this.handleFixtureStateSyncResponse(msg);
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

  handleFixtureStateChangeResponse({ payload }: FixtureStateChangeResponse) {
    const { rendererId, fixturePath, fixtureState } = payload;
    const state = this.getOwnState();
    const urlParams: UrlParams = this.context.getState('urlParams');

    if (isEqual(fixtureState, state.fixtureState)) {
      console.warn(
        '[RendererResponseHandler] fixtureStateChange response ignored ' +
          'because existing fixture state is identical'
      );
      return;
    }

    if (fixturePath !== urlParams.fixturePath) {
      console.warn(
        '[RendererResponseHandler] fixtureStateChange response ignored ' +
          `because it doesn't match the selected fixture`
      );
      return;
    }

    this.setOwnState({ ...state, fixtureState }, () => {
      this.sendFixtureStateChangeToOtherRenderers(
        rendererId,
        fixturePath,
        fixtureState
      );
    });
  }

  handleFixtureStateSyncResponse({ payload }: FixtureStateSyncResponse) {
    const { fixturePath, fixtureState } = payload;
    const state = this.getOwnState();
    const urlParams: UrlParams = this.context.getState('urlParams');

    if (fixturePath !== urlParams.fixturePath) {
      console.warn(
        '[RendererResponseHandler] fixtureStateSync response ignored ' +
          `because it doesn't match the selected fixture`
      );
      return;
    }

    this.setOwnState({
      ...state,
      fixtureState
    });
  }

  sendFixtureStateChangeToOtherRenderers(
    changedRendererId: RendererId,
    fixturePath: string,
    fixtureState: FixtureState
  ) {
    const { rendererIds } = this.getOwnState();

    if (rendererIds.length > 1) {
      const otherRendererIds = rendererIds.filter(
        rendererId => rendererId !== changedRendererId
      );
      otherRendererIds.forEach(rendererId => {
        this.context.emitEvent('renderer.request', {
          type: 'setFixtureState',
          payload: {
            rendererId,
            fixturePath,
            fixtureStateChange: fixtureState
          }
        });
      });
    }
  }
}
