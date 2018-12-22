// @flow

import { registerPlugin } from 'react-plugin';
import { FixtureActions } from './FixtureActions';

import type { RouterState } from '../Router';

export function register() {
  const { plug } = registerPlugin({ name: 'fixtureHeader' });

  plug({
    slotName: 'fixtureHeader',
    render: FixtureActions,
    getProps: ({ getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');

      return {
        urlParams,
        setUrlParams: newUrlParams => {
          callMethod('router.setUrlParams', newUrlParams);
        }
      };
    }
  });
}
