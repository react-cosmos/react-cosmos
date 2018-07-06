// @flow

import until from 'async-until';

import type { ComponentRef } from 'react-cosmos-flow/react';

export const routerProps = {
  goTo: (url: string) => console.log('go to', url),
  routeLink: (e: SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log('link to', e.currentTarget.href);
  }
};

export const readyMessage = {
  type: 'loaderReady',
  fixtures: {
    ComponentA: ['foo', 'bar'],
    ComponentB: ['baz', 'qux']
  }
};

export async function init({ compRef }: { compRef: ?ComponentRef }) {
  if (!compRef) {
    throw new Error('ComponentPlayground ref missing in fixture.init');
  }

  // Wait until fetch mock has responded and component state is ready to receive
  // messages from inside the Loader frame
  await until(hasLoaderStatus(compRef, 'WEB_INDEX_OK'));

  window.postMessage(readyMessage, '*');

  // Wait until Playground state has been updated before running any assertions
  await until(hasLoaderStatus(compRef, 'READY'));
}

function hasLoaderStatus(compInstance, status) {
  return () => compInstance.state.loaderStatus === status;
}
