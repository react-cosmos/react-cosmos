import React from 'react';
import { string } from 'prop-types';
import { MemoryRouter, Route } from 'react-router';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

export default () => {
  const RouterProxy = props => {
    const { value: NextProxy, next } = props.nextProxy;
    const { route } = props.fixture;
    const nextProxy = <NextProxy {...props} nextProxy={next()} />;

    if (!route) {
      return nextProxy;
    }

    return (
      <MemoryRouter initialEntries={[route]}>
        <Route path={route} render={() => nextProxy} />
      </MemoryRouter>
    );
  };

  RouterProxy.propTypes = {
    ...proxyPropTypes,
    route: string,
  };

  return RouterProxy;
};
