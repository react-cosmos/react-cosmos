import { RouterSpec } from '../../../../ui/specs/RouterSpec';
import { RendererCoreContext } from '../shared';

export function getSelectedFixtureId({ getMethodsOf }: RendererCoreContext) {
  return getMethodsOf<RouterSpec>('router').getSelectedFixtureId();
}
