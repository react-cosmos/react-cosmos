import until from 'async-until';
import { OK, READY } from '../index';

export const routerProps = {
  goTo: url => console.log('go to', url),
  routeLink: e => {
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

export async function ref(compInstance) {
  // Wait until fetch mock has responded and component state is ready to receive
  // messages from inside the Loader frame
  await until(hasLoaderStatus(compInstance, OK));

  window.postMessage(readyMessage, '*');

  // Wait until Playground state has been updated before running any assertions
  await until(hasLoaderStatus(compInstance, READY));
}

function hasLoaderStatus(compInstance, status) {
  return () => compInstance.state.loaderStatus === status;
}
