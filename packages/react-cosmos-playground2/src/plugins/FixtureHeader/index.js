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

      return {
        urlParams,
        setUrlParams: newUrlParams =>
          callMethod('router.setUrlParams', newUrlParams),
        isFixturePathValid: fixturePath =>
          callMethod('renderer.isFixturePathValid', fixturePath)
      };
    }
  });
}
