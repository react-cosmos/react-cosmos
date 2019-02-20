import { RouterSpec } from '../../Router/public';
import { Context } from '../shared';

export function getSelectedFixtureId({ getMethodsOf }: Context) {
  return getMethodsOf<RouterSpec>('router').getSelectedFixtureId();
}
