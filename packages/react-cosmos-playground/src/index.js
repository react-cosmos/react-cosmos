import { Router } from 'react-querystring-router';
import ComponentPlayground from './components/ComponentPlayground';
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
  const { loaderUri, projectKey } = opts;

  return new Router({
    container: createDomContainer(),
    getComponentClass: () => ComponentPlayground,
    getComponentProps: params => ({
      ...params,
      loaderUri,
      projectKey
    }),
    onChange: params => {
      document.title = getPageTitle(params);
    }
  });
};
