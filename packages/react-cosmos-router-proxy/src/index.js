import React from 'react';
import { string } from 'prop-types';
import { MemoryRouter, Route } from 'react-router';
import { proxyPropTypes } from 'react-cosmos-shared';
import LocationInterceptor from './LocationInterceptor';

function locationToUrl({ pathname, search, hash }) {
  return `${pathname}${search ? search : ''}${hash ? hash : ''}`;
}

export default () => {
  const RouterProxy = props => {
    const { nextProxy, fixture, onFixtureUpdate } = props;
    const { value: NextProxy, next } = nextProxy;
    const { route, url, location } = fixture;
    const nextProxyEl = <NextProxy {...props} nextProxy={next()} />;

    if (!url && !location) {
      return nextProxyEl;
    }

    const handleLocationChange = location => {
      const url = locationToUrl(location);
      onFixtureUpdate({ location, url });
    };

    if (location && url !== locationToUrl(location)) {
      console.log('URL and LOCATION mismatch', url, locationToUrl(location));
    }

    return (
      <MemoryRouter initialEntries={[location || url]}>
        <LocationInterceptor onLocationChange={handleLocationChange}>
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
    url: string
  };

  return RouterProxy;
};
