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
  mockState('renderer', { primaryRendererId: null, renderers: {} });
  mockState('router', { urlParams: { fixturePath: 'fooFixture.js' } });
  mockMethod('renderer.getPrimaryRendererState', () => null);
  mockMethod('renderer.isValidFixturePath', () => false);

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  expect(getByText(/responsive/i)).toHaveAttribute('disabled');
});
