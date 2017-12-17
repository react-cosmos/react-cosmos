// @flow

import createStateProxy from 'react-cosmos-state-proxy';
import createErrorCatchProxy from './components/ErrorCatchProxy';
import { createDomRenderer } from './dom-renderer';
import { connectLoader } from './connect-loader';

import type { LoaderOpts } from 'react-cosmos-shared/src/types';
import type { Proxy, Fixtures } from './types';

type Args = {
  proxies: Array<Proxy>,
  fixtures: Fixtures,
  loaderOpts?: LoaderOpts,
  dismissRuntimeErrors?: Function
};

let StateProxy;
let ErrorCatchProxy;

export function mount(args: Args) {
  const { proxies, fixtures, loaderOpts, dismissRuntimeErrors } = args;
  const renderer = createDomRenderer(loaderOpts);

  // Reuse proxy instances
  if (!StateProxy) {
    StateProxy = createStateProxy();
    ErrorCatchProxy = createErrorCatchProxy();
  }

  connectLoader({
    renderer,
    proxies: [ErrorCatchProxy, ...proxies, StateProxy],
    fixtures,
    dismissRuntimeErrors
  });
}
