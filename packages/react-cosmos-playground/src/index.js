// @flow

import { Router } from 'react-querystring-router';
import ComponentPlayground from './components/ComponentPlayground';
import { getPageTitle } from './utils/page-title';
import './register-plugins';
import './utils/global.less';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';

let container;

export default (options: PlaygroundOpts) => {
  return new Router({
    container: createDomContainer(),
    getComponentClass: () => ComponentPlayground,
    getComponentProps: params => ({
      ...params,
      options
    }),
    onChange: params => {
      document.title = getPageTitle(params);
    }
  });
};

function createDomContainer() {
  if (!container) {
    container = document.createElement('div');
    if (document.body) {
      document.body.appendChild(container);
    }
  }

  return container;
}
