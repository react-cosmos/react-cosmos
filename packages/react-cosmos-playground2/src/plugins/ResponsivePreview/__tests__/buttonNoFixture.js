// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockConfig, mockState } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

it('renders disabled button', async () => {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockState('router', { urlParams: {} });
  mockState('renderer', { primaryRendererId: null, renderers: {} });

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  expect(getByText(/responsive/i)).toHaveAttribute('disabled');
});
