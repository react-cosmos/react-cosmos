import { RouterSpec } from '../../Router/spec';
import { RendererCoordinatorContext } from '../shared';

export function getUrlParams({ getMethodsOf }: RendererCoordinatorContext) {
  return getMethodsOf<RouterSpec>('router').getUrlParams();
}
