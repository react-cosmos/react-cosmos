import * as React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins, MethodHandlers } from 'react-plugin';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { RouterSpec } from '../../Router/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins({
  selectFixture = jest.fn(),
  unselectFixture = jest.fn()
}: Partial<MethodHandlers<RouterSpec>> = {}) {
  register();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo', name: null }),
    selectFixture,
    unselectFixture
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => true
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererHeader" />);
}

const RENDERER_ACTION = 'foo action';
function mockRendererAction() {
  mockPlug('rendererActions', () => <>{RENDERER_ACTION}</>);
}

const FIXTURE_ACTION = 'bar action';
function mockFixtureAction() {
  mockPlug('fixtureActions', () => <>{FIXTURE_ACTION}</>);
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

it('renders renderer actions', async () => {
  registerTestPlugins();
  mockRendererAction();
  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(RENDERER_ACTION));
});

it('renders fixture actions', async () => {
  registerTestPlugins();
  mockFixtureAction();
  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(FIXTURE_ACTION));
});
