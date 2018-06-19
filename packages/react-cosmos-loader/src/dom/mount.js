// @flow

import { createErrorCatchProxy } from '../components/ErrorCatchProxy';
import { createDomRenderer } from './renderer';
import { connectLoader } from '../connect-loader';

import type { LoaderWebOpts, LoaderMessage } from 'react-cosmos-flow/loader';
import type { Proxy } from 'react-cosmos-flow/proxy';
import type { Fixtures } from 'react-cosmos-flow/module';

type Args = {
  proxies: Array<Proxy>,
  fixtures: Fixtures,
  loaderOpts?: LoaderWebOpts,
  dismissRuntimeErrors?: Function
};

let ErrorCatchProxy;

export async function mount(args: Args) {
  const { proxies, fixtures, loaderOpts, dismissRuntimeErrors } = args;
  const renderer = createDomRenderer(loaderOpts);

  // Reuse proxy instances
  if (!ErrorCatchProxy) {
    ErrorCatchProxy = createErrorCatchProxy();
  }

  const destroyLoader = await connectLoader({
    renderer,
    proxies: [ErrorCatchProxy, ...proxies],
    fixtures,
    subscribe,
    unsubscribe,
    sendMessage,
    dismissRuntimeErrors
  });

  return () => {
    destroyLoader();
  };
}

let connectMsgHandler;

function subscribe(msgHandler) {
  connectMsgHandler = msgHandler;
  window.addEventListener('message', onMessage, false);
}

function unsubscribe() {
  window.removeEventListener('message', onMessage);
}

function onMessage({ data }: { data: LoaderMessage }) {
  if (connectMsgHandler) {
    connectMsgHandler(data);
  }
}

function sendMessage(msg: LoaderMessage) {
  parent.postMessage(msg, '*');
}
