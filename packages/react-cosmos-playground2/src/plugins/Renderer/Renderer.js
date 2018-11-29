// @flow

import { Component } from 'react';
import { isEqual, mapValues, forEach } from 'lodash';
import { updateState } from 'react-cosmos-shared2/util';
import { PluginContext } from '../../plugin';
import { getUrlParams } from '../Router/selectors';
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
import type { PluginContextValue } from '../../plugin';
import type { UrlParams } from '../Router';
import type { RendererState, RendererItemState } from './shared';

const DEFAULT_RENDERER_STATE = {
  fixtureState: null
};

export class Renderer extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    return null;
  }

  getOwnState(): RendererState {
    return this.context.getState('renderer');
  }

  setOwnState(stateChange: StateUpdater<RendererState>, cb?: Function) {
    this.context.setState('renderer', stateChange, cb);
  }

  getRendererItemState(rendererId: RendererId) {
    const { renderers } = this.getOwnState();

    if (!renderers[rendererId]) {
      throw new Error(`Missing renderer state for rendererId ${rendererId}`);
    }

    return renderers[rendererId];
  }

  setRendererState(
    updater: (RendererItemState, RendererId) => RendererItemState,
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
      rendererItemState => ({
        ...rendererItemState,
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
    const { fixturePath } = getUrlParams(this.context);

    if (!fixturePath) {
      console.warn(
        '[Renderer] Trying to set fixture state with no fixture selected'
      );
      return;
    }

    this.setRendererState(
      rendererItemState => ({
        ...rendererItemState,
        fixtureState: updateState(rendererItemState.fixtureState, stateChange)
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
      const rendererItemState = renderers[rendererId] || DEFAULT_RENDERER_STATE;

      return {
        ...otherState,
        primaryRendererId: primaryRendererId || rendererId,
        renderers: {
          ...renderers,
          [rendererId]: {
            ...rendererItemState,
            fixtures,
            fixtureState
          }
        }
      };
    };

    this.setOwnState(updater, () => {
      const { fixturePath } = getUrlParams(this.context);

      if (fixturePath) {
        this.postSelectFixtureRequest(rendererId, fixturePath, fixtureState);
      }
    });
  }

  handleFixtureStateChangeResponse({ payload }: FixtureStateChangeResponse) {
    const { rendererId, fixturePath, fixtureState } = payload;
    const urlParams = getUrlParams(this.context);
    const rendererItemState = this.getRendererItemState(rendererId);

    if (isEqual(fixtureState, rendererItemState.fixtureState)) {
      console.info(
        '[Renderer] fixtureStateChange response ignored ' +
          'because existing fixture state is identical'
      );
      return;
    }

    if (fixturePath !== urlParams.fixturePath) {
      console.warn(
        '[Renderer] fixtureStateChange response ignored ' +
          `because it doesn't match the selected fixture`
      );
      return;
    }

    const { primaryRendererId } = this.getOwnState();
    const isPrimaryRenderer = rendererId === primaryRendererId;

    this.setRendererState(
      (rendererItemState, curRendererId) =>
        curRendererId === rendererId || isPrimaryRenderer
          ? { ...rendererItemState, fixtureState }
          : rendererItemState,
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
    cb: (rendererId: RendererId, rendererItemState: RendererItemState) => mixed
  ) {
    const { renderers } = this.getOwnState();

    forEach(renderers, (rendererItemState, rendererId) => {
      cb(rendererId, rendererItemState);
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
