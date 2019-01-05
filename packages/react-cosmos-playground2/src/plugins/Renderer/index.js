// @flow

import { isEqual, mapValues, forEach } from 'lodash';
import { updateState } from 'react-cosmos-shared2/util';
import { registerPlugin } from 'react-plugin';

import type {
  RendererId,
  RendererRequest,
  RendererResponse,
  RendererReadyResponse,
  FixtureListChangeResponse,
  FixtureStateChangeResponse
} from 'react-cosmos-shared2/renderer';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RouterState } from '../Router';
import type { RendererConfig } from '../../index.js.flow';
import type { RendererState, RendererItemState } from './shared';

export type { RendererConfig } from '../../index.js.flow';
export type { RendererItemState, RendererState } from './shared';

const DEFAULT_RENDERER_STATE = {
  fixtureState: null
};

export function register() {
  const { method } = registerPlugin<RendererConfig, RendererState>({
    name: 'renderer',
    defaultConfig: {
      webUrl: null,
      enableRemote: false
    },
    initialState: {
      primaryRendererId: null,
      renderers: {}
    }
  });

  method('getPrimaryRendererState', handleGetPrimaryRendererState);
  method('isValidFixturePath', handleIsFixturePathValid);
  method('selectFixture', handleSelectFixture);
  method('unselectFixture', handleUnselectFixture);
  method('setFixtureState', handleSetFixtureState);
  method('selectPrimaryRenderer', handleSelectPrimaryRenderer);
  method('receiveResponse', handleReceiveResponse);
}

function handleGetPrimaryRendererState({ getState }) {
  return getPrimaryRendererState(getState());
}

function handleIsFixturePathValid({ getState }, fixturePath: string) {
  const primaryRendererState = getPrimaryRendererState(getState());

  return primaryRendererState
    ? primaryRendererState.fixtures.indexOf(fixturePath) !== -1
    : false;
}

function handleSelectFixture(context, fixturePath: string) {
  // NOTE: The fixture state used to be reset in the local renderer state
  // before posting the "selectFixture" request, but that no longer happens.
  // Resetting renderer state when selecting a fixture makes sense in
  // abstract, but it creates an unnecessary flash of layout whenever
  // reselecting the current fixture, or when selecting a fixture of the same
  // component. By keeping the fixture state until the new fixture state is
  // received from the renderer the transition between fixtures is smoother.
  forEachRenderer(context, rendererId =>
    postSelectFixtureRequest(context, rendererId, fixturePath, null)
  );
}

function handleUnselectFixture(context) {
  resetRendererState(context, () => {
    forEachRenderer(context, rendererId =>
      postUnselectFixtureRequest(context, rendererId)
    );
  });
}

function handleSetFixtureState(context, stateChange, cb) {
  const { fixturePath } = getUrlParams(context);

  if (!fixturePath) {
    console.warn(
      '[Renderer] Trying to set fixture state with no fixture selected'
    );
    return;
  }

  setRendererState(
    context,
    rendererItemState => ({
      ...rendererItemState,
      fixtureState: updateState(rendererItemState.fixtureState, stateChange)
    }),
    () => {
      if (typeof cb === 'function') cb();

      forEachRenderer(context, (rendererId, { fixtureState }) =>
        postSetFixtureStateRequest(
          context,
          rendererId,
          fixturePath,
          fixtureState
        )
      );
    }
  );
}

function handleSelectPrimaryRenderer(
  { setState },
  primaryRendererId: RendererId
) {
  setState(prevState => ({
    ...prevState,
    primaryRendererId
  }));
}

function handleReceiveResponse(context, msg: RendererResponse) {
  switch (msg.type) {
    case 'rendererReady':
      return handleRendererReadyResponse(context, msg);
    case 'fixtureListChange':
      return handleFixtureListChangeResponse(context, msg);
    case 'fixtureStateChange':
      return handleFixtureStateChangeResponse(context, msg);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}

function handleRendererReadyResponse(
  context,
  { payload }: RendererReadyResponse
) {
  const { rendererId, fixtures } = payload;

  const updater = prevState => {
    // The first announced renderer becomes the primary one
    const primaryRendererId = prevState.primaryRendererId || rendererId;
    const isPrimaryRenderer = rendererId === primaryRendererId;

    // Reset fixture state of all renderers when primary renderer resets
    const prevRenderers = isPrimaryRenderer
      ? mapValues(prevState.renderers, rendererItemState => ({
          ...rendererItemState,
          fixtureState: null
        }))
      : prevState.renderers;

    return {
      ...prevState,
      primaryRendererId,
      renderers: {
        ...prevRenderers,
        [rendererId]: {
          ...DEFAULT_RENDERER_STATE,
          fixtures,
          fixtureState: isPrimaryRenderer
            ? null
            : getPrimaryRendererFixtureState(prevState)
        }
      }
    };
  };

  context.setState(updater, () => {
    const { fixturePath } = getUrlParams(context);

    // Tell the renderer to select the fixture path from the URL when a new
    // renderer announces itself (via the rendererReady response). This occurs
    // when opening the UI on a URL that contains a selected fixture path.
    if (fixturePath) {
      const { fixtureState } = context.getState().renderers[rendererId];
      postSelectFixtureRequest(context, rendererId, fixturePath, fixtureState);
    }
  });
}

function handleFixtureListChangeResponse(
  context,
  { payload }: FixtureListChangeResponse
) {
  const { rendererId, fixtures } = payload;

  setRendererState(context, (rendererItemState, curRendererId) =>
    curRendererId === rendererId
      ? { ...rendererItemState, fixtures }
      : rendererItemState
  );
}

function handleFixtureStateChangeResponse(
  context,
  { payload }: FixtureStateChangeResponse
) {
  const { rendererId, fixturePath, fixtureState } = payload;
  const urlParams = getUrlParams(context);
  const rendererItemState = getRendererItemState(context, rendererId);

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

  const { primaryRendererId } = context.getState();
  const isPrimaryRenderer = rendererId === primaryRendererId;

  setRendererState(
    context,
    (rendererItemState, curRendererId) =>
      curRendererId === rendererId || isPrimaryRenderer
        ? { ...rendererItemState, fixtureState }
        : rendererItemState,
    () => {
      // Sync secondary renderers with changed primary renderer fixture state
      if (isPrimaryRenderer) {
        forEachRenderer(context, curRendererId => {
          if (curRendererId !== rendererId) {
            postSetFixtureStateRequest(
              context,
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

function forEachRenderer(
  context,
  cb: (rendererId: RendererId, rendererItemState: RendererItemState) => mixed
) {
  const { renderers } = context.getState();

  forEach(renderers, (rendererItemState, rendererId) => {
    cb(rendererId, rendererItemState);
  });
}

function postSelectFixtureRequest(
  context,
  rendererId: RendererId,
  fixturePath: string,
  fixtureState: null | FixtureState
) {
  postRendererRequest(context, {
    type: 'selectFixture',
    payload: {
      rendererId,
      fixturePath,
      fixtureState
    }
  });
}

function postUnselectFixtureRequest(context, rendererId: RendererId) {
  postRendererRequest(context, {
    type: 'unselectFixture',
    payload: {
      rendererId
    }
  });
}

function postSetFixtureStateRequest(
  context,
  rendererId: RendererId,
  fixturePath: string,
  fixtureState: null | FixtureState
) {
  postRendererRequest(context, {
    type: 'setFixtureState',
    payload: {
      rendererId,
      fixturePath,
      fixtureState
    }
  });
}

function postRendererRequest({ emitEvent }, msg: RendererRequest) {
  emitEvent('request', msg);
}

function getRendererItemState({ getState }, rendererId: RendererId) {
  const { renderers } = getState();

  if (!renderers[rendererId]) {
    throw new Error(`Missing renderer state for rendererId ${rendererId}`);
  }

  return renderers[rendererId];
}

function resetRendererState(context, cb?: () => mixed) {
  setRendererState(
    context,
    rendererItemState => ({
      ...rendererItemState,
      ...DEFAULT_RENDERER_STATE
    }),
    cb
  );
}

function setRendererState(
  { setState },
  updater: (RendererItemState, RendererId) => RendererItemState,
  cb?: () => mixed
) {
  setState(
    prevState => ({
      ...prevState,
      renderers: mapValues(prevState.renderers, updater)
    }),
    cb
  );
}

function getUrlParams({ getStateOf }) {
  const { urlParams }: RouterState = getStateOf('router');

  return urlParams;
}

function getPrimaryRendererState({
  primaryRendererId,
  renderers
}: RendererState): null | RendererItemState {
  if (!primaryRendererId) {
    return null;
  }

  if (!renderers[primaryRendererId]) {
    throw new Error(
      `primaryRendererId "${primaryRendererId}" points to missing renderer state`
    );
  }

  return renderers[primaryRendererId];
}

function getPrimaryRendererFixtureState(state) {
  const primaryRendererState = getPrimaryRendererState(state);

  return primaryRendererState ? primaryRendererState.fixtureState : null;
}
