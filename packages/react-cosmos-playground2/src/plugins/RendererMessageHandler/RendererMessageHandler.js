// @flow

import { Component } from 'react';
import { isEqual, mapValues, forEach } from 'lodash';
import { updateState } from 'react-cosmos-shared2/util';
import { PlaygroundContext } from '../../PlaygroundContext';
import { getExistingFixtureState } from './selectors';

import type { StateUpdater, SetState } from 'react-cosmos-shared2/util';
import type {
  RendererId,
  RendererRequest,
  RendererResponse,
  FixtureListResponse,
  FixtureStateChangeResponse
} from 'react-cosmos-shared2/renderer';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { UrlParams } from '../Router';
import type { RendererState, RenderersState } from './shared';

const defaultRendererState = {
  fixtureState: null
};

export class RendererMessageHandler extends Component<{}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  render() {
    return null;
  }

  getOwnState(): RenderersState {
    return this.context.getState('renderers');
  }

  setOwnState(state: StateUpdater<RenderersState>, cb?: Function) {
    this.context.setState('renderers', state, cb);
  }

  getRendererState(rendererId: RendererId) {
    const { renderers } = this.getOwnState();

    if (!renderers[rendererId]) {
      throw new Error(`Missing renderer state for rendererId ${rendererId}`);
    }

    return renderers[rendererId];
  }

  setRendererState(
    rendererId: RendererId,
    state: $Shape<RendererState>,
    cb?: Function
  ) {
    this.setOwnState(prevState => {
      const { primaryRendererId, renderers } = prevState;
      const rendererState = renderers[rendererId] || defaultRendererState;

      return {
        ...prevState,
        primaryRendererId: primaryRendererId || rendererId,
        renderers: {
          ...renderers,
          [rendererId]: {
            ...rendererState,
            ...state
          }
        }
      };
    }, cb);
  }

  removeRendererResponseListener = () => {};
  unregisterMethods = () => {};

  componentDidMount() {
    const { registerMethods, addEventListener } = this.context;

    this.unregisterMethods = registerMethods({
      'renderer.selectFixture': this.handleSelectFixture,
      'renderer.setFixtureState': this.handleSetFixtureState
    });
    this.removeRendererResponseListener = addEventListener(
      'renderer.response',
      this.handleRendererResponse
    );
  }

  componentWillUnmount() {
    this.unregisterMethods();
    this.removeRendererResponseListener();
  }

  handleSelectFixture = (fixturePath: string) => {
    this.setOwnState(
      prevState => ({
        ...prevState,
        renderers: mapValues(prevState.renderers, rendererState => ({
          ...rendererState,
          ...defaultRendererState
        }))
      }),
      () => {
        this.postMassSelectFixtureRequest(fixturePath, null);
      }
    );
  };

  handleSetFixtureState: SetState<null | FixtureState> = (stateChange, cb) => {
    const { fixturePath }: UrlParams = this.context.getState('urlParams');

    if (!fixturePath) {
      console.warn(
        '[RendererMessageHandler] Trying to set fixture state with no fixture selected'
      );
      return;
    }

    this.setOwnState(
      prevState => ({
        ...prevState,
        renderers: mapValues(prevState.renderers, rendererState => ({
          ...rendererState,
          fixtureState: updateState(rendererState.fixtureState, stateChange)
        }))
      }),
      () => {
        if (typeof cb === 'function') cb();
        this.postMassSetFixtureStateRequest(fixturePath);
      }
    );
  };

  handleRendererResponse = (msg: RendererResponse) => {
    switch (msg.type) {
      case 'fixtureList':
        return this.handleFixtureListResponse(msg);
      case 'fixtureStateChange':
        return this.handleFixtureStateChangeResponse(msg);
      default:
      // No need to handle every message. Maybe some plugin cares about it.
    }
  };

  handleFixtureListResponse({ payload }: FixtureListResponse) {
    const { rendererId, fixtures } = payload;
    const fixtureState = getExistingFixtureState(this.getOwnState());

    this.setRendererState(rendererId, { fixtures, fixtureState }, () => {
      const { fixturePath }: UrlParams = this.context.getState('urlParams');

      if (fixturePath) {
        this.postSelectFixtureRequest(rendererId, fixturePath, fixtureState);
      }
    });
  }

  handleFixtureStateChangeResponse({ payload }: FixtureStateChangeResponse) {
    const { rendererId, fixturePath, fixtureState } = payload;
    const urlParams: UrlParams = this.context.getState('urlParams');
    const rendererState = this.getRendererState(rendererId);

    if (isEqual(fixtureState, rendererState.fixtureState)) {
      console.warn(
        '[RendererMessageHandler] fixtureStateChange response ignored ' +
          'because existing fixture state is identical'
      );
      return;
    }

    if (fixturePath !== urlParams.fixturePath) {
      console.warn(
        '[RendererMessageHandler] fixtureStateChange response ignored ' +
          `because it doesn't match the selected fixture`
      );
      return;
    }

    this.setRendererState(rendererId, { fixtureState });
  }

  postMassSelectFixtureRequest(
    fixturePath: string,
    fixtureState: null | FixtureState
  ) {
    const { renderers } = this.getOwnState();

    forEach(renderers, (rendererState, rendererId) => {
      this.postSelectFixtureRequest(rendererId, fixturePath, fixtureState);
    });
  }

  postMassSetFixtureStateRequest(fixturePath: string) {
    const { renderers } = this.getOwnState();

    forEach(renderers, ({ fixtureState }, rendererId) => {
      this.postSetFixtureStateRequest(rendererId, fixturePath, fixtureState);
    });
  }

  postSelectFixtureRequest(
    rendererId: RendererId,
    fixturePath: string,
    fixtureState: null | FixtureState
  ) {
    this.postRendererRequest({
      type: 'selectFixture',
      payload: {
        rendererId,
        fixturePath,
        fixtureState
      }
    });
  }

  postSetFixtureStateRequest(
    rendererId: RendererId,
    fixturePath: string,
    fixtureState: null | FixtureState
  ) {
    this.postRendererRequest({
      type: 'setFixtureState',
      payload: {
        rendererId,
        fixturePath,
        fixtureState
      }
    });
  }

  postRendererRequest(msg: RendererRequest) {
    this.context.emitEvent('renderer.request', msg);
  }
}
