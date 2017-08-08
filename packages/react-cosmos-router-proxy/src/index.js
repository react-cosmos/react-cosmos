import React from 'react';
import { string } from 'prop-types';
import { MemoryRouter } from 'react-router';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

export default () => {
  const RouterProxy = props => {
    const { value: NextProxy } = props.nextProxy;
    const { route } = props.fixture;

    return (
      <MemoryRouter initialEntries={route ? [route] : undefined}>
        <NextProxy {...props} nextProxy={props.nextProxy.next()} />
      </MemoryRouter>
    );
  };

  RouterProxy.propTypes = {
    ...proxyPropTypes,
    route: string,
  };

  return RouterProxy;
};
