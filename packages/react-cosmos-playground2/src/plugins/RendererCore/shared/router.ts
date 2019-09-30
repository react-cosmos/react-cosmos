import { RouterSpec } from '../../Router/public';
import { RendererCoreContext } from '../shared';

export function getSelectedFixtureId({ getMethodsOf }: RendererCoreContext) {
  return getMethodsOf<RouterSpec>('router').getSelectedFixtureId();
}
