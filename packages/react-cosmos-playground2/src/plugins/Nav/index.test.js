// @flow

import React from 'react';
import delay from 'delay';
import { render, waitForElement, fireEvent } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockState,
  mockMethod
} from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins({ urlParams = {} } = {}) {
  register();

  mockConfig('core', { fixturesDir: 'fixtures' });
  mockState('router', { urlParams });
  mockState('renderer', {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': {
        fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js'],
        fixtureState: null
      }
    }
  });

  mockMethod('storage.getItem', () => Promise.resolve(null));
  mockMethod('storage.setItem', () => Promise.resolve(undefined));
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="left" />);
}

it('renders fixture list from renderer state', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sets "fixturePath" router param on fixture click', async () => {
  registerTestPlugins();

  const handleSetUrlParams = jest.fn();
  mockMethod('router.setUrlParams', handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/zwei/i));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'fixtures/zwei.js'
  });
});

it('clears router params on home button click', async () => {
  registerTestPlugins({ urlParams: { fixturePath: 'fixtures/zwei.js' } });

  const handleSetUrlParams = jest.fn();
  mockMethod('router.setUrlParams', handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/home/i));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {});
});

it('hides fullscreen button when no fixture is selected', () => {
  registerTestPlugins();
  const { queryByText } = loadTestPlugins();

  expect(queryByText(/fullscreen/i)).toBeNull();
});

it('sets "fullScreen" router param on fullscreen button click', () => {
  registerTestPlugins({ urlParams: { fixturePath: 'fixtures/zwei.js' } });

  const handleSetUrlParams = jest.fn();
  mockMethod('router.setUrlParams', handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/fullscreen/i));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'fixtures/zwei.js',
    fullScreen: true
  });
});

// This test confirms the existence of the "nav" element under normal
// conditions, and thus the validity of the "full screen" test
it('renders nav element', async () => {
  registerTestPlugins();
  const { getByTestId } = loadTestPlugins();

  await waitForElement(() => getByTestId('nav'));
});

it('does not render nav element in full screen mode', async () => {
  registerTestPlugins({
    urlParams: { fixturePath: 'fixtures/zwei.js', fullScreen: true }
  });
  const { queryByTestId } = loadTestPlugins();

  // Make sure the nav element doesn't appear after in next event loops
  await delay(100);

  expect(queryByTestId('nav')).toBeNull();
});
