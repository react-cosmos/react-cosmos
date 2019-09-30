import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '.';
import { RendererActionSlot } from '../../shared/slots/RendererActionSlot';
import { mockRouter } from '../../testHelpers/pluginMocks';

afterEach(resetPlugins);

const fixtureId = { fixtureId: { path: 'foo.js', name: null } };

function loadTestPlugins() {
  loadPlugins();
  return render(
    <RendererActionSlot slotProps={{ fixtureId }} plugOrder={[]} />
  );
}

it('renders fullscreen button', async () => {
  register();
  const { selectFixture } = mockRouter();

  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/go fullscreen/i));

  expect(selectFixture).toBeCalledWith(expect.any(Object), fixtureId, true);
});
