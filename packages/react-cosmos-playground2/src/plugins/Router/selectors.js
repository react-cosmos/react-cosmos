// @flow

import type { PluginContextValue } from '../../plugin';
import type { UrlParams } from './shared';

export function getUrlParams(context: PluginContextValue): UrlParams {
  return context.getState('router').urlParams;
}
