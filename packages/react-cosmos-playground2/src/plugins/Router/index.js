// @flow

import { isEqual } from 'lodash';
import { registerPlugin } from 'react-plugin';
import {
  getUrlParamsFromLocation,
  pushUrlParamsToHistory,
  subscribeToLocationChanges
} from './window';

import type { UrlParams, RouterState } from './shared';
export type { UrlParams, RouterState } from './shared';

export function register() {
  const { init, method } = registerPlugin<{}, RouterState>({
    name: 'router',
    initialState: { urlParams: {} }
  });

  method('setUrlParams', handleSetUrlParams);

  init(context => {
    const { setState } = context;

    setState({
      urlParams: getUrlParamsFromLocation()
    });

    return subscribeToLocationChanges((urlParams: UrlParams) => {
      const { fixturePath } = getUrlParams(context);
      const hasFixtureChanged = urlParams.fixturePath !== fixturePath;

      setState({ urlParams }, () => {
        if (hasFixtureChanged) {
          emitFixtureChangeEvent(context);
        }
      });
    });
  });
}

function handleSetUrlParams(context, nextUrlParams: UrlParams) {
  const urlParams = getUrlParams(context);
  const hasFixtureChanged = nextUrlParams.fixturePath !== urlParams.fixturePath;
  const areUrlParamsEqual = isEqual(nextUrlParams, urlParams);

  context.setState({ urlParams: nextUrlParams }, () => {
    // Setting identical url params is considered a "reset" request
    if (hasFixtureChanged || areUrlParamsEqual) {
      emitFixtureChangeEvent(context);
    }

    if (!areUrlParamsEqual) {
      pushUrlParamsToHistory(getUrlParams(context));
    }
  });
}

function emitFixtureChangeEvent(context) {
  const { emitEvent } = context;
  const { fixturePath } = getUrlParams(context);

  emitEvent('fixtureChange', fixturePath);
}

function getUrlParams(context) {
  return context.getState().urlParams;
}
