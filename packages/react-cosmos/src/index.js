/* global window */

import startLoader from './start-loader';
import startPlayground from './start-playground';

module.exports = ({
  proxies,
  components,
  fixtures,
  containerQuerySelector,
}) => {
  const loaderUri = '/loader/';
  const { pathname } = window.location;

  if (pathname === loaderUri) {
    startLoader({
      proxies,
      components,
      fixtures,
      containerQuerySelector,
    });
  } else {
    startPlayground({
      fixtures,
      loaderUri,
    });
  }
};
