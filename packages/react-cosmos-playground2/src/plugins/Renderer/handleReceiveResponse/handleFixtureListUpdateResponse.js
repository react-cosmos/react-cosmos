// @flow

import { setRendererState } from '../shared';
import { selectFixtureFromUrlParams } from './shared';

import type { FixtureListUpdateResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleFixtureListUpdateResponse(
  context: RendererContext,
  { payload }: FixtureListUpdateResponse
) {
  const { rendererId, fixtures } = payload;

  const updater = (rendererItemState, curRendererId) =>
    curRendererId === rendererId
      ? { ...rendererItemState, fixtures }
      : rendererItemState;

  setRendererState(context, updater, () =>
    selectFixtureFromUrlParams(context, rendererId)
  );
}
