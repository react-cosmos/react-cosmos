// @flow

import { Component } from 'react';
import { isEqual, mapValues, forEach } from 'lodash';
import { updateState } from 'react-cosmos-shared2/util';
import { PlaygroundContext } from '../../PlaygroundContext';
import { getPrimaryRendererState } from './selectors';

import type { StateUpdater } from 'react-cosmos-shared2/util';
import type {
  RendererId,
  RendererRequest,
  RendererResponse,
  FixtureListResponse,
  FixtureStateChangeResponse
} from 'react-cosmos-shared2/renderer';
import type {
  FixtureState,
  SetFixtureState
} from 'react-cosmos-shared2/fixtureState';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { UrlParams } from '../Router';
import type { RendererState, RenderersState } from './shared';

const DEFAULT_RENDERER_STATE = {
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
    updater: (RendererState, RendererId) => RendererState,
    cb?: () => mixed
  ) {
    this.setOwnState(
      prevState => ({
        ...prevState,
        renderers: mapValues(prevState.renderers, updater)
      }),
      cb
    );
  }

  resetRendererState(cb?: () => mixed) {
    this.setRendererState(
      rendererState => ({
        ...rendererState,
        ...DEFAULT_RENDERER_STATE
      }),
      cb
    );
  }

  removeRendererResponseListener = () => {};
  unregisterMethods = () => {};

  componentDidMount() {
    const { registerMethods, addEventListener } = this.context;

    this.unregisterMethods = registerMethods({
      'renderer.selectFixture': this.handleSelectFixture,
      'renderer.unselectFixture': this.handleUnselectFixture,
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
    this.resetRendererState(() => {
      this.forEachRenderer(rendererId =>
        this.postSelectFixtureRequest(rendererId, fixturePath, null)
      );
    });
  };

  handleUnselectFixture = () => {
    this.resetRendererState(() => {
      this.forEachRenderer(rendererId =>
        this.postUnselectFixtureRequest(rendererId)
      );
    });
  };

  handleSetFixtureState: SetFixtureState = (stateChange, cb) => {
    const { fixturePath }: UrlParams = this.context.getState('urlParams');

    if (!fixturePath) {
      console.warn(
        '[RendererMessageHandler] Trying to set fixture state with no fixture selected'
      );
      return;
    }

    this.setRendererState(
      rendererState => ({
        ...rendererState,
        fixtureState: updateState(rendererState.fixtureState, stateChange)
      }),
      () => {
        if (typeof cb === 'function') cb();

        this.forEachRenderer((rendererId, { fixtureState }) =>
          this.postSetFixtureStateRequest(rendererId, fixturePath, fixtureState)
        );
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

    const primaryRendererState = getPrimaryRendererState(this.getOwnState());
    const fixtureState = primaryRendererState
      ? primaryRendererState.fixtureState
      : null;

    const updater = ({ primaryRendererId, renderers, ...otherState }) => {
      const rendererState = renderers[rendererId] || DEFAULT_RENDERER_STATE;

      return {
        ...otherState,
        primaryRendererId: primaryRendererId || rendererId,
        renderers: {
          ...renderers,
          [rendererId]: {
            ...rendererState,
            fixtures,
            fixtureState
          }
        }
      };
    };

    this.setOwnState(updater, () => {
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
      console.info(
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

    const { primaryRendererId } = this.getOwnState();
    const isPrimaryRenderer = rendererId === primaryRendererId;

    this.setRendererState(
      (rendererState, curRendererId) =>
        curRendererId === rendererId || isPrimaryRenderer
          ? { ...rendererState, fixtureState }
          : rendererState,
      () => {
        // Sync secondary renderers with changed primary renderer fixture state
        if (isPrimaryRenderer) {
          this.forEachRenderer(curRendererId => {
            if (curRendererId !== rendererId) {
              this.postSetFixtureStateRequest(
                curRendererId,
                fixturePath,
                fixtureState
              );
            }
          });
        }
      }
    );
  }

  forEachRenderer(
    cb: (rendererId: RendererId, rendererState: RendererState) => mixed
  ) {
    const { renderers } = this.getOwnState();

    forEach(renderers, (rendererState, rendererId) => {
      cb(rendererId, rendererState);
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

  postUnselectFixtureRequest(rendererId: RendererId) {
    this.postRendererRequest({
      type: 'unselectFixture',
      payload: {
        rendererId
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
