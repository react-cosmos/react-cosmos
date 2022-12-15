import { RouterSpec } from '../../Router/spec.js';
import { RendererCoreContext } from '../shared/index.js';

export function getSelectedFixtureId({ getMethodsOf }: RendererCoreContext) {
  return getMethodsOf<RouterSpec>('router').getSelectedFixtureId();
}
