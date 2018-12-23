// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockState,
  mockMethod
} from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

it('renders disabled button', async () => {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockState('router', { urlParams: {} });
  mockState('renderer', { primaryRendererId: null, renderers: {} });
  mockMethod('renderer.getPrimaryRendererState', () => null);

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  expect(getByText(/responsive/i)).toHaveAttribute('disabled');
});
