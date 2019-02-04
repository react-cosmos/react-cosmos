import * as React from 'react';
import delay from 'delay';
import { render, waitForElement, fireEvent } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockMethods } from '../../testHelpers/plugin2';
import { StorageSpec } from '../Storage/public';
import { UrlParams, RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
import { register } from '.';

afterEach(cleanup);

const fixtures = ['ein.js', 'zwei.js', 'drei.js'];

function registerTestPlugins() {
  register();
  mockMethods<StorageSpec>('storage', {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(undefined)
  });
  mockMethods<CoreSpec>('core', {
    getProjectId: () => 'mockProjectId',
    getFixtureFileVars: () => ({
      fixturesDir: 'fixtures',
      fixtureFileSuffix: 'fixture'
    })
  });
  mockMethods<RendererCoordinatorSpec>('rendererCoordinator', {
    isRendererConnected: () => true,
    getFixtures: () => fixtures
  });
}

function mockRouter(
  urlParams: UrlParams,
  setUrlParams: RouterSpec['methods']['getUrlParams'] = jest.fn()
) {
  mockMethods<RouterSpec>('router', {
    getUrlParams: () => urlParams,
    setUrlParams
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="left" />);
}

it('renders fixture list from renderer state', async () => {
  registerTestPlugins();
  mockRouter({});
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sets "fixturePath" router param on fixture click', async () => {
  registerTestPlugins();

  const handleSetUrlParams = jest.fn();
  mockRouter({}, handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/zwei/i));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'zwei.js'
  });
});

// This test confirms the existence of the "nav" element under normal
// conditions, and thus the validity of the "full screen" test
it('renders nav element', async () => {
  registerTestPlugins();
  mockRouter({});
  const { getByTestId } = loadTestPlugins();

  await waitForElement(() => getByTestId('nav'));
});

it('does not render nav element in full screen mode', async () => {
  registerTestPlugins();
  mockRouter({ fixturePath: 'zwei.js', fullScreen: true });
  const { queryByTestId } = loadTestPlugins();

  // Make sure the nav element doesn't appear async in the next event loops
  await delay(100);

  expect(queryByTestId('nav')).toBeNull();
});
