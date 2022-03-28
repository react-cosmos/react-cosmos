import { RouterSpec } from 'react-cosmos-shared2/ui';
import { RendererCoreContext } from '../shared';

export function getSelectedFixtureId({ getMethodsOf }: RendererCoreContext) {
  return getMethodsOf<RouterSpec>('router').getSelectedFixtureId();
}
