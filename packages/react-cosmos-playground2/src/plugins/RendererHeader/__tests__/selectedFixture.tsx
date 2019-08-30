import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Slot, loadPlugins, resetPlugins } from 'react-plugin';
import { mockPlug } from '../../../testHelpers/plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  const { selectFixture, unselectFixture } = mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo', name: null })
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => true
  });
  return { selectFixture, unselectFixture };
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererHeader" />);
}

const RENDERER_ACTION = 'foo action';
function mockRendererAction() {
  mockPlug('rendererAction', () => <>{RENDERER_ACTION}</>);
}

const FIXTURE_ACTION = 'bar action';
function mockFixtureAction() {
  mockPlug('fixtureAction', () => <>{FIXTURE_ACTION}</>);
}

it('renders close button', async () => {
  const { unselectFixture } = registerTestPlugins();

  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/close fixture/i));

  expect(unselectFixture).toBeCalled();
});

it('renders refresh button', async () => {
  const { selectFixture } = registerTestPlugins();

  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/reload fixture/i));

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
  getByText(RENDERER_ACTION);
});

it('renders fixture actions', async () => {
  registerTestPlugins();
  mockFixtureAction();
  const { getByText } = loadTestPlugins();
  getByText(FIXTURE_ACTION);
});
