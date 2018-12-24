// @flow

import { registerPlugin } from 'react-plugin';
import { FixtureHeader } from './FixtureHeader';

import type { RouterState } from '../Router';

export function register() {
  const { plug } = registerPlugin({ name: 'fixtureHeader' });

  plug({
    slotName: 'fixtureHeader',
    render: FixtureHeader,
    getProps: ({ getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const primaryRendererState = callMethod(
        'renderer.getPrimaryRendererState'
      );

      return {
        urlParams,
        primaryRendererState,
        setUrlParams: newUrlParams =>
          callMethod('router.setUrlParams', newUrlParams),
        isValidFixturePath: fixturePath =>
          callMethod('renderer.isValidFixturePath', fixturePath)
      };
    }
  });
}
