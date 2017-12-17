// @flow

import { Router } from 'react-querystring-router';
import ComponentPlayground from './components/ComponentPlayground';
import getPageTitle from './utils/page-title';

import './utils/global.less';

import type { PlaygroundOpts } from 'react-cosmos-shared/src/types';

let container;

const createDomContainer = () => {
  if (!container) {
    container = document.createElement('div');
    if (document.body) {
      document.body.appendChild(container);
    }
  }

  return container;
};

// Use module.exports to avoid having to call .default() when attached to
// the global window namespace
module.exports = (opts: PlaygroundOpts) => {
  const { loaderUri, projectKey, responsiveDevices, webpackConfigType } = opts;

  return new Router({
    container: createDomContainer(),
    getComponentClass: () => ComponentPlayground,
    getComponentProps: params => ({
      ...params,
      options: {
        loaderUri,
        projectKey,
        responsiveDevices,
        webpackConfigType
      }
    }),
    onChange: params => {
      document.title = getPageTitle(params);
    }
  });
};
