// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../plugin';
import { CallMethod } from '../../testHelpers/CallMethod';

// Plugins have side-effects: they register themselves
import '.';

const mockSetItem = jest.fn();

jest.mock('localforage', () => ({
  getItem: () => Promise.resolve('fooValue'),
  setItem: (...args) => {
    mockSetItem(...args);
    return Promise.resolve('setReturnFooValue');
  }
}));

afterEach(() => {
  cleanup();
  mockSetItem.mockClear();
});

it('gets item from localForage', async () => {
  const handleGetItemReturn = jest.fn();
  renderPlayground(
    <CallMethod
      methodName="storage.getItem"
      args={['fooKey']}
      onReturn={handleGetItemReturn}
    />
  );

  await wait(async () => {
    const [[returnValue]] = handleGetItemReturn.mock.calls;
    expect(await returnValue).toBe('fooValue');
  });
});

it('sets item to localForage', async () => {
  const handleSetItemReturn = jest.fn();
  renderPlayground(
    <CallMethod
      methodName="storage.setItem"
      args={['fooKey', 'fooValue']}
      onReturn={handleSetItemReturn}
    />
  );

  await wait(() => expect(mockSetItem).toBeCalledWith('fooKey', 'fooValue'));

  await wait(async () => {
    const [[returnValue]] = handleSetItemReturn.mock.calls;
    expect(await returnValue).toBe('setReturnFooValue');
  });
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider>
      <Slot name="global" />
      {otherNodes}
    </PluginProvider>
  );
}
