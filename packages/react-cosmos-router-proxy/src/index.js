import React from 'react';
import { string } from 'prop-types';
import { MemoryRouter, Route } from 'react-router';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';
import LocationInterceptor from './LocationInterceptor';

export default () => {
  const RouterProxy = props => {
    const { nextProxy, fixture, onFixtureUpdate } = props;
    const { value: NextProxy, next } = nextProxy;
    const { route, url } = fixture;

    const children = (
      <LocationInterceptor onLocation={url => onFixtureUpdate({ url })}>
        <NextProxy {...props} nextProxy={next()} />
      </LocationInterceptor>
    );

    if (!url) {
      return children;
    }

    return (
      <MemoryRouter initialEntries={[url]}>
        {route ? <Route path={route} render={() => children} /> : children}
      </MemoryRouter>
    );
  };

  RouterProxy.propTypes = {
    ...proxyPropTypes,
    route: string,
    url: string,
  };

  return RouterProxy;
};
