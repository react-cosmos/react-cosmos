// @flow

// import merge from 'lodash.merge';
import { splitUnserializableParts } from 'react-cosmos-shared';
import { createContext } from './create-context';

import type { LoaderMessage } from 'react-cosmos-shared/src/types';
import type { Renderer, Proxy, Fixtures, FixtureNames } from './types';

type Args = {
  renderer: Renderer,
  proxies: Array<Proxy>,
  fixtures: Fixtures
};

let isListening = false;

export function connectLoader(args: Args) {
  const { proxies, fixtures, renderer } = args;

  // Let parent know loader is ready to render, along with the initial
  // fixture list (which might update later due to HMR)
  postMessageToParent({
    type: 'loaderReady',
    fixtures: extractFixtureNames(fixtures)
  });

  function onContextUpdate(fixturePart) {
    const { serializable } = splitUnserializableParts(fixturePart);
    postMessageToParent({
      type: 'fixtureUpdate',
      fixtureBody: serializable
    });
  }

  async function onMessage({ data }: LoaderMessage) {
    if (data.type === 'fixtureSelect') {
      // TODO: Handle selecting null component/fixture
      const fixture = fixtures[data.component][data.fixture];
      const { mount } = createContext({
        renderer,
        proxies,
        fixture,
        onUpdate: onContextUpdate
      });
      await mount();

      // Notify back parent with the serializable contents of the loaded fixture
      const { serializable } = splitUnserializableParts(fixture);
      postMessageToParent({
        type: 'fixtureLoad',
        fixtureBody: serializable
      });
    }
  }

  if (!isListening) {
    window.addEventListener('message', onMessage, false);
    isListening = true;
  }

  // TODO: Return destroy method
  // return function destroy() {
  //   window.removeEventListener('message', onMessage);
  //   isListening = false;
  // };
}

function postMessageToParent(data) {
  parent.postMessage(data, '*');
}

function extractFixtureNames(fixtures: Fixtures): FixtureNames {
  return Object.keys(fixtures).reduce((acc, next) => {
    acc[next] = Object.keys(fixtures[next]);
    return acc;
  }, {});
}
