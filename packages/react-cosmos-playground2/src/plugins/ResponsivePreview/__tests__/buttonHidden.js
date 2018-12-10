// @flow

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { resetPlugins, registerPlugin, loadPlugins, Slot } from 'react-plugin';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetPlugins();
});

it('does not show button', async () => {
  const { queryByText } = loadTestPlugins();

  expect(queryByText(/responsive/i)).toBeNull();
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  registerPlugin({ name: 'core' });
  registerPlugin({ name: 'renderer' });
  registerPlugin({ name: 'router' });
  extraSetup();

  loadPlugins({
    state: {
      renderer: {
        primaryRendererId: null,
        renderers: {}
      },
      router: { urlParams: {} },
      responsivePreview: { enabled: false, viewport: null }
    }
  });

  return render(<Slot name="header-buttons" />);
}
