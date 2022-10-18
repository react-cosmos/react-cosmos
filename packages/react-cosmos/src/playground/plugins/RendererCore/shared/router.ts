import { RouterSpec } from '../../Router/spec';
import { RendererCoreContext } from '../shared';

export function getSelectedFixtureId({ getMethodsOf }: RendererCoreContext) {
  return getMethodsOf<RouterSpec>('router').getSelectedFixtureId();
}
