import { RouterSpec } from '../../Router/public';
import { Context } from '../shared';

export function getUrlParams({ getMethodsOf }: Context) {
  return getMethodsOf<RouterSpec>('router').getUrlParams();
}
