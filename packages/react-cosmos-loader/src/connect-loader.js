// @flow

import merge from 'lodash.merge';
import { splitUnserializableParts } from 'react-cosmos-shared';
import { createContext } from './create-context';

import type { LoaderMessage } from 'react-cosmos-shared/src/types';
import type { Renderer, Proxy, Fixture, Fixtures, FixtureNames } from './types';

type Args = {
  renderer: Renderer,
  proxies: Array<Proxy>,
  fixtures: Fixtures
};

let isListening = false;

export function connectLoader(args: Args) {
  const { proxies, fixtures, renderer } = args;

  // This will be populated on fixtureSelect events
  let currentFixture: ?Fixture;

  async function loadFixture(fixture, clearPrevInstance = true) {
    currentFixture = fixture;
    const { mount } = createContext({
      renderer,
      proxies,
      fixture,
      onUpdate: onContextUpdate
    });
    await mount(clearPrevInstance);
  }

  function onContextUpdate(fixturePart) {
    const { serializable } = splitUnserializableParts(fixturePart);
    postMessageToParent({
      type: 'fixtureUpdate',
      fixtureBody: serializable
    });
  }

  async function onMessage({ data }: LoaderMessage) {
    if (data.type === 'fixtureSelect') {
      const { component, fixture } = data;
      if (fixtures[component] && fixtures[component][fixture]) {
        await loadFixture(fixtures[component][fixture]);

        // Notify back parent with the serializable contents of the loaded fixture
        const { serializable } = splitUnserializableParts(currentFixture);
        postMessageToParent({
          type: 'fixtureLoad',
          fixtureBody: serializable
        });
      } else {
        console.error(`[Cosmos] Missing fixture for ${component}:${fixture}`);
      }
    } else if (data.type === 'fixtureEdit') {
      if (!currentFixture) {
        console.error('[Cosmos] No selected fixture to edit');
      } else {
        // Note: Creating fixture context from scratch on every fixture edit.
        // This means that the component will always go down the
        // componentDidMount path (instead of componentWillReceiveProps) when
        // user edits fixture via fixture editor. In the future we might want to
        // sometimes update the fixture context instead of resetting it.
        await loadFixture(applyFixturePart(currentFixture, data.fixtureBody));
      }
    }
  }

  if (!isListening) {
    window.addEventListener('message', onMessage, false);
    isListening = true;

    // Let parent know loader is ready to render, along with the initial
    // fixture list (which might update later due to HMR)
    postMessageToParent({
      type: 'loaderReady',
      fixtures: extractFixtureNames(fixtures)
    });
  } else {
    // Let parent know loader is ready to render, along with the initial
    // fixture list (which might update later due to HMR)
    postMessageToParent({
      type: 'fixtureListUpdate',
      fixtures: extractFixtureNames(fixtures)
    });
  }

  return function destroy() {
    window.removeEventListener('message', onMessage);
    isListening = false;
  };
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

function applyFixturePart(currentFixture: Fixture, fixturePart: {}): Fixture {
  const { unserializable, serializable } = splitUnserializableParts(
    currentFixture
  );
  return merge({}, unserializable, {
    ...serializable,
    ...fixturePart
  });
}
