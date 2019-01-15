// @flow

import { forEach, mapValues } from 'lodash';

import type { IPluginContext } from 'react-plugin';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererId, FixtureNames } from 'react-cosmos-shared2/renderer';
import type { RendererConfig } from '../../../index.js.flow';

export type RendererItemState = {
  fixtures: FixtureNames,
  fixtureState: null | FixtureState
};

export type RendererState = {
  primaryRendererId: null | RendererId,
  renderers: {
    [rendererId: RendererId]: RendererItemState
  }
};

export type RendererContext = IPluginContext<RendererConfig, RendererState>;

export const DEFAULT_RENDERER_STATE = {
  fixtureState: null
};

export function getRendererState(
  { getState }: RendererContext,
  rendererId: RendererId
) {
  const { renderers } = getState();

  if (!renderers[rendererId]) {
    throw new Error(`Missing renderer state for rendererId ${rendererId}`);
  }

  return renderers[rendererId];
}

export function getPrimaryRendererState({
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

export function forEachRenderer(
  context: RendererContext,
  cb: (rendererId: RendererId, rendererItemState: RendererItemState) => mixed
) {
  const { renderers } = context.getState();

  forEach(renderers, (rendererItemState, rendererId) => {
    cb(rendererId, rendererItemState);
  });
}

export function setRendererState(
  { setState }: RendererContext,
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
