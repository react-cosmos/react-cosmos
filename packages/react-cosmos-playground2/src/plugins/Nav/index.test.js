// @flow

import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from 'react-testing-library';
import { Slot, resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import { register } from '.';

afterEach(() => {
  cleanup();
  resetPlugins();
});

const mockRendererState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js'],
      fixtureState: null
    }
  }
};

it('renders fixture list from renderer state', async () => {
  const { getByText } = loadTestPlugins(() => {
    registerPlugin({
      name: 'router',
      initialState: { urlParams: {} }
    });
  });

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sets "fixturePath" router param on fixture click', async () => {
  const handleSetUrlParams = jest.fn();

  const { getByText } = loadTestPlugins(() => {
    const { method } = registerPlugin({
      name: 'router',
      initialState: { urlParams: {} }
    });
    method('setUrlParams', handleSetUrlParams);
  });

  fireEvent.click(getByText(/zwei/i));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'fixtures/zwei.js'
  });
});

it('clears router params on home button click', async () => {
  const handleSetUrlParams = jest.fn();

  const { getByText } = loadTestPlugins(() => {
    const { method } = registerPlugin({
      name: 'router',
      initialState: { urlParams: { fixturePath: 'fixtures/zwei.js' } }
    });
    method('setUrlParams', handleSetUrlParams);
  });

  fireEvent.click(getByText(/home/i));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {});
});

it('hides fullscreen button when no fixture is selected', () => {
  const { queryByText } = loadTestPlugins(() => {
    registerPlugin({
      name: 'router',
      initialState: { urlParams: {} }
    });
  });

  expect(queryByText(/fullscreen/i)).toBeNull();
});

it('sets "fullScreen" router param on fullscreen button click', () => {
  const handleSetUrlParams = jest.fn();

  const { getByText } = loadTestPlugins(() => {
    const { method } = registerPlugin({
      name: 'router',
      initialState: { urlParams: { fixturePath: 'fixtures/zwei.js' } }
    });
    method('setUrlParams', handleSetUrlParams);
  });

  fireEvent.click(getByText(/fullscreen/i));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'fixtures/zwei.js',
    fullScreen: true
  });
});

// This test confirms the existence of the "nav" element under normal
// conditions, and thus the validity of the "full screen" test
it('renders nav element', async () => {
  const { getByTestId } = loadTestPlugins(() => {
    registerPlugin({
      name: 'router',
      initialState: { urlParams: {} }
    });
  });

  await waitForElement(() => getByTestId('nav'));
});

it('does not render nav element in full screen mode', async () => {
  const { queryByTestId } = loadTestPlugins(() => {
    registerPlugin({
      name: 'router',
      initialState: {
        urlParams: { fixturePath: 'fixtures/zwei.js', fullScreen: true }
      }
    });
  });

  // Make sure the nav element doesn't appear after in next event loops
  await new Promise(res => setTimeout(res, 300));

  expect(queryByTestId('nav')).toBeNull();
});

function loadTestPlugins(extraSetup = () => {}) {
  register();

  const { method } = registerPlugin({ name: 'storage' });
  method('getItem', () => Promise.resolve(null));
  method('setItem', () => Promise.resolve(undefined));

  registerPlugin({ name: 'core' });
  registerPlugin({ name: 'renderer' });
  extraSetup();

  loadPlugins({
    config: {
      playground: {
        projectId: 'mockProjectId',
        fixturesDir: 'fixtures'
      }
    },
    state: {
      renderer: mockRendererState
    }
  });

  return render(<Slot name="left" />);
}
