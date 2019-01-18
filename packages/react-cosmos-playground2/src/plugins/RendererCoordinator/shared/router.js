// @flow

import type { RouterState } from '../../Router';
import type { RendererContext } from '.';

export function getUrlParams({ getStateOf }: RendererContext) {
  const { urlParams }: RouterState = getStateOf('router');

  return urlParams;
}
