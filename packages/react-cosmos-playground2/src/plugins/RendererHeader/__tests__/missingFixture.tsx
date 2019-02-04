import * as React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin2';
import { RouterSpec } from '../../Router/public';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(handleSetUrlParams = () => {}) {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath: 'foo' }),
    setUrlParams: handleSetUrlParams
  });
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererHeader" />);
}

it('renders missing state message', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/fixture not found/i));
});

it('renders home button', async () => {
  const handleSetUrlParams = jest.fn();
  registerTestPlugins(handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/home/));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {});
});

it('renders disabled fullscreen button', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  expect(getByText(/fullscreen/i)).toHaveAttribute('disabled');
});
