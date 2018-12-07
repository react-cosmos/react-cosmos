// @flow

import type { IPluginContext } from 'react-plugin';
import type { RouterState } from './shared';

export function getUrlParams(context: IPluginContext<{}, RouterState>) {
  return context.getState().urlParams;
}
