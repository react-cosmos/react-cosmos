// @flow

import { createErrorCatchProxy } from './components/ErrorCatchProxy';
import { createDomRenderer } from './dom-renderer';
import { connectLoader } from './connect-loader';

import type { LoaderOpts } from 'react-cosmos-flow/loader';
import type { Proxy } from 'react-cosmos-flow/proxy';
import type { Fixtures } from 'react-cosmos-flow/module';

type Args = {
  proxies: Array<Proxy>,
  fixtures: Fixtures,
  loaderOpts?: LoaderOpts,
  dismissRuntimeErrors?: Function
};

let ErrorCatchProxy;

export function mount(args: Args) {
  const { proxies, fixtures, loaderOpts, dismissRuntimeErrors } = args;
  const renderer = createDomRenderer(loaderOpts);

  // Reuse proxy instances
  if (!ErrorCatchProxy) {
    ErrorCatchProxy = createErrorCatchProxy();
  }

  connectLoader({
    renderer,
    proxies: [ErrorCatchProxy, ...proxies],
    fixtures,
    dismissRuntimeErrors
  });
}
