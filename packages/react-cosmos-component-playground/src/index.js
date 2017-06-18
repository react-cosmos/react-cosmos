import { Router } from 'react-querystring-router';
import ReactComponentPlayground from './components/ComponentPlayground';
import getPageTitle from './utils/page-title';

import './utils/global.less';

let container;

const createDomContainer = () => {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  return container;
};

// Use module.exports to avoid having to call .default() when attached to
// the global window namespace
module.exports = opts => {
  const { loaderUri } = opts;

  return new Router({
    container: createDomContainer(),
    getComponentClass: () => ReactComponentPlayground,
    getComponentProps: params => ({
      ...params,
      loaderUri,
    }),
    onChange: params => {
      document.title = getPageTitle(params);
    },
  });
};
