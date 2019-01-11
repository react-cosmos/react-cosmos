// @flow

import React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockState,
  mockMethod,
  mockPlug
} from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(handleSetUrlParams = () => {}) {
  register();
  mockState('router', { urlParams: { fixturePath: 'foo' } });
  mockMethod('router.setUrlParams', handleSetUrlParams);
  mockMethod('renderer.isReady', () => true);
  mockMethod('renderer.isValidFixturePath', () => true);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererHeader" />);
}

it('renders close button', async () => {
  const handleSetUrlParams = jest.fn();
  registerTestPlugins(handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/close/));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {});
});

it('renders refresh button', async () => {
  const handleSetUrlParams = jest.fn();
  registerTestPlugins(handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/refresh/));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'foo'
  });
});

it('renders fullscreen button', async () => {
  const handleSetUrlParams = jest.fn();
  registerTestPlugins(handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/fullscreen/));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'foo',
    fullScreen: true
  });
});

it('renders "fixtureActions" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'fixtureActions', render: 'pluggable actions' });

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/pluggable actions/i));
});
