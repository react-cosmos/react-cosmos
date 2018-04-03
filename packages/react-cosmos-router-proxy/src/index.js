import React from 'react';
import { string, any } from 'prop-types';
import { MemoryRouter, Route } from 'react-router';
import { proxyPropTypes } from 'react-cosmos-shared/react';
import LocationInterceptor from './LocationInterceptor';
import urlParser from 'url';

export function createRouterProxy() {
  const RouterProxy = props => {
    const { nextProxy, fixture, onFixtureUpdate } = props;
    const { value: NextProxy, next } = nextProxy;
    const { route, url, locationState } = fixture;
    const nextProxyEl = <NextProxy {...props} nextProxy={next()} />;

    if (locationState && !url) {
      throw new Error('Must provide a url in fixture to use locationState');
    }

    if (!url) {
      return nextProxyEl;
    }

    const handleUrlChange = url => {
      onFixtureUpdate({ url });
    };

    const handleLocationStateChange = locationState => {
      onFixtureUpdate({ locationState });
    };

    const location = buildLocation(url, locationState);

    return (
      <MemoryRouter initialEntries={[location]}>
        <LocationInterceptor
          onUrlChange={handleUrlChange}
          onLocationStateChange={handleLocationStateChange}
        >
          {route ? (
            <Route path={route} render={() => nextProxyEl} />
          ) : (
            nextProxyEl
          )}
        </LocationInterceptor>
      </MemoryRouter>
    );
  };

  RouterProxy.propTypes = {
    ...proxyPropTypes,
    route: string,
    url: string,
    locationState: any
  };

  return RouterProxy;
}

function buildLocation(url, locationState) {
  const { pathname, search, hash } = urlParser.parse(url);
  return {
    pathname,
    search,
    hash,
    key: 'mocked',
    state: locationState
  };
}
