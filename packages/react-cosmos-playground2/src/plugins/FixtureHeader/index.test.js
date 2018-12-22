// @flow

import React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockState,
  mockMethod,
  mockPlug
} from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins({ urlParams = {} } = {}) {
  register();
  mockState('router', { urlParams });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="fixtureHeader" />);
}

it('renders blank state', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/no fixture selected/i));
});

it('renders close button', async () => {
  registerTestPlugins({ urlParams: { fixturePath: 'foo' } });

  const handleSetUrlParams = jest.fn();
  mockMethod('router.setUrlParams', handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/close/));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {});
});

it('renders refresh button', async () => {
  registerTestPlugins({ urlParams: { fixturePath: 'foo' } });

  const handleSetUrlParams = jest.fn();
  mockMethod('router.setUrlParams', handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/refresh/));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'foo'
  });
});

it('renders fullscreen button', async () => {
  registerTestPlugins({ urlParams: { fixturePath: 'foo' } });

  const handleSetUrlParams = jest.fn();
  mockMethod('router.setUrlParams', handleSetUrlParams);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/fullscreen/));

  expect(handleSetUrlParams).toBeCalledWith(expect.any(Object), {
    fixturePath: 'foo',
    fullScreen: true
  });
});

it('renders "fixtureActions" slot', async () => {
  registerTestPlugins({ urlParams: { fixturePath: 'foo' } });
  mockPlug({ slotName: 'fixtureActions', render: 'pluggable actions' });

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/pluggable actions/i));
});
