// @flow

import merge from 'lodash.merge';
import { splitUnserializableParts } from 'react-cosmos-shared';
import { createContext } from './create-context';

import type { ComponentType } from 'react';
import type { LoaderMessage } from 'react-cosmos-flow/loader';
import type { FixtureType } from 'react-cosmos-flow/fixture';
import type { Proxy } from 'react-cosmos-flow/proxy';
import type { Renderer } from 'react-cosmos-flow/context';
import type { Fixtures, FixtureNames } from 'react-cosmos-flow/module';

type Args = {
  renderer: Renderer,
  proxies: Array<Proxy>,
  fixtures: Fixtures,
  dismissRuntimeErrors?: Function
};

let unbindPrev: ?Function;

// This will be populated on fixtureSelect events
let selected: ?{
  component: string,
  fixture: string
};

// The fixture cache can contain
// - Fixture updates received from proxy chain via context's onUpdate handler
// - Fixture edits received from Playground UI
// The cache is cleared when a fixture (including the current one) is selected
let fixtureCache: ?FixtureType<*, *>;

/**
 * Connect fixture context to remote Playground UI via window.postMessage.
 * In the future we'll replace window.postMessage with a fully remote (likely
 * websockets) communication channel, which will allow the Playground and the
 * Loader to live in completely different environments (eg. Control a Native
 * component instance from a web Playground UI).
 *
 * It both receives fixture edits from parent frame and forwards fixture
 * updates bubbled up from proxy chain (due to state changes) to parent frame.
 */
export async function connectLoader(args: Args) {
  const { proxies, fixtures, renderer, dismissRuntimeErrors } = args;

  async function loadFixture(fixture: FixtureType<*, *>, notifyParent = true) {
    const { mount } = createContext({
      renderer,
      proxies,
      fixture,
      onUpdate: onContextUpdate
    });

    await mount();

    if (notifyParent) {
      // Notify back parent with the serializable contents of the loaded fixture
      const { serializable } = splitUnserializableParts(fixture);
      postMessageToParent({
        type: 'fixtureLoad',
        fixtureBody: serializable
      });
    }
  }

  function onContextUpdate(fixturePart) {
    if (!selected) {
      return;
    }

    // This can be the first update after a fixture was selected
    if (!fixtureCache) {
      const { component, fixture } = selected;
      fixtureCache = fixtures[component][fixture];
    }

    // NOTE: Updates extend the fixture fields
    // Apply the entire updated fixture part...
    fixtureCache = applyFixturePart(fixtureCache, fixturePart);

    // ...but only the serializable part can be sent to parent
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
        selected = { component, fixture };

        // No need for a cache at this point. Until a fixtureUpdate or
        // fixtureEdit event is receved, fixture source changes will be
        // applied immediately.
        fixtureCache = undefined;

        const selectedFixture = fixtures[component][fixture];
        await loadFixture(selectedFixture);

        if (dismissRuntimeErrors) {
          dismissRuntimeErrors();
        }
      } else {
        console.error(`[Cosmos] Missing fixture for ${component}:${fixture}`);
      }
    } else if (data.type === 'fixtureEdit') {
      if (!selected) {
        console.error('[Cosmos] No selected fixture to edit');
      } else {
        // This can be the first edit after a fixture was selected
        if (!fixtureCache) {
          const { component, fixture } = selected;
          fixtureCache = fixtures[component][fixture];
        }

        // NOTE: Edits override the entire (serializable) fixture body
        fixtureCache = applyFixtureBody(fixtureCache, data.fixtureBody);

        // Note: Creating fixture context from scratch on every fixture edit.
        // This means that the component will always go down the
        // componentDidMount path (instead of componentWillReceiveProps) when
        // user edits fixture via fixture editor. In the future we might want
        // to sometimes update the fixture context instead of resetting it.
        await loadFixture(fixtureCache, false);
      }
    }
  }

  function bind() {
    window.addEventListener('message', onMessage, false);
  }

  function unbind() {
    window.removeEventListener('message', onMessage);
    unbindPrev = undefined;
  }

  const isFirstCall = !unbindPrev;

  // Implicitly unbind prev context when new one is created
  if (unbindPrev) {
    unbindPrev();
  }
  unbindPrev = unbind;

  // Always bind onMessage handler to latest input
  bind();

  if (isFirstCall) {
    // Let parent know loader is ready to render, along with the initial
    // fixture list (which might update later due to HMR)
    postMessageToParent({
      type: 'loaderReady',
      fixtures: extractFixtureNames(fixtures)
    });
  } else {
    // Keep parent up to date with fixture list
    postMessageToParent({
      type: 'fixtureListUpdate',
      fixtures: extractFixtureNames(fixtures)
    });

    if (selected) {
      // Use the fixture cache contents if present, but always re-create the
      // context to ensure latest proxies and components are used.
      const { component, fixture } = selected;
      const originalFixture = fixtures[component][fixture];

      if (!originalFixture) {
        // Maybe fixture was renamed
        selected = undefined;
        fixtureCache = undefined;
      } else if (fixtureCache) {
        await loadFixture({
          ...fixtureCache,
          component: originalFixture.component
        });
      } else {
        await loadFixture(originalFixture);
      }
    }
  }

  return function destroy() {
    if (unbindPrev) {
      unbindPrev();
      selected = undefined;
      fixtureCache = undefined;
    }
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

function applyFixturePart<P: {}, C: ComponentType<P>>(
  currentFixture: FixtureType<P, C>,
  fixturePart: {}
): FixtureType<P, C> {
  return { ...currentFixture, ...fixturePart };
}

function applyFixtureBody<P: {}, C: ComponentType<P>>(
  currentFixture: FixtureType<P, C>,
  fixtureBody: {}
): FixtureType<P, C> {
  const { unserializable } = splitUnserializableParts(currentFixture);

  return merge({}, unserializable, fixtureBody);
}
