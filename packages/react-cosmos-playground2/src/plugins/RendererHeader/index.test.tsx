import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '.';
import { mockPlug } from '../../testHelpers/plugin';
import { mockRouter } from '../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(
    <Slot
      name="rendererHeader"
      slotProps={{
        fixtureId: { path: 'foo', name: null }
      }}
    />
  );
}

function mockRendererAction(mockText: string) {
  mockPlug('rendererAction', () => <>{mockText}</>);
}

it('renders close button', async () => {
  register();
  const { unselectFixture } = mockRouter();

  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/close fixture/i));

  expect(unselectFixture).toBeCalled();
});

it('renders reload button', async () => {
  register();
  const { selectFixture } = mockRouter();

  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/reload fixture/i));

  expect(selectFixture).toBeCalledWith(
    expect.any(Object),
    { path: 'foo', name: null },
    false
  );
});

it('renders renderer actions', async () => {
  register();
  mockRouter();
  mockRendererAction('foo action');

  const { getByText } = loadTestPlugins();
  getByText('foo action');
});
