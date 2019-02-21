import * as React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins, MethodHandlers } from 'react-plugin';
import { cleanup, mockMethodsOf, mockPlug } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins({
  selectFixture = jest.fn(),
  unselectFixture = jest.fn()
}: Partial<MethodHandlers<RouterSpec>> = {}) {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => ({ path: 'foo', name: null }),
    isFullScreen: () => false,
    selectFixture,
    unselectFixture
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    isRendererConnected: () => true,
    isValidFixtureSelected: () => true
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererHeader" />);
}

it('renders close button', async () => {
  const unselectFixture = jest.fn();
  registerTestPlugins({ unselectFixture });

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/close/));

  expect(unselectFixture).toBeCalled();
});

it('renders refresh button', async () => {
  const selectFixture = jest.fn();
  registerTestPlugins({ selectFixture });

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/refresh/));

  expect(selectFixture).toBeCalledWith(
    expect.any(Object),
    { path: 'foo', name: null },
    false
  );
});

it('renders fullscreen button', async () => {
  const selectFixture = jest.fn();
  registerTestPlugins({ selectFixture });

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/fullscreen/));

  expect(selectFixture).toBeCalledWith(
    expect.any(Object),
    { path: 'foo', name: null },
    true
  );
});

it('renders "fixtureActions" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'fixtureActions', render: 'pluggable actions' });

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/pluggable actions/i));
});
