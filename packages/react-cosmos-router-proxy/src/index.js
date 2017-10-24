import React from 'react';
import { string } from 'prop-types';
import { MemoryRouter, Route } from 'react-router';
import { proxyPropTypes } from 'react-cosmos-shared';
import LocationInterceptor from './LocationInterceptor';

export default () => {
  const RouterProxy = props => {
    const { nextProxy, fixture, onFixtureUpdate } = props;
    const { value: NextProxy, next } = nextProxy;
    const { route, url } = fixture;
    const nextProxyEl = <NextProxy {...props} nextProxy={next()} />;

    if (!url) {
      return nextProxyEl;
    }

    return (
      <MemoryRouter initialEntries={[url]}>
        <LocationInterceptor onLocation={url => onFixtureUpdate({ url })}>
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
