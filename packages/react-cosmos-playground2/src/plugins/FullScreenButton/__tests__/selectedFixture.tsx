import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import { mockRouter } from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(
    <Slot
      name="rendererAction"
      slotProps={{
        fixtureId: { path: 'foo', name: null }
      }}
    />
  );
}

it('renders fullscreen button', async () => {
  register();
  const { selectFixture } = mockRouter();

  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/go fullscreen/i));

  expect(selectFixture).toBeCalledWith(
    expect.any(Object),
    { path: 'foo', name: null },
    true
  );
});
