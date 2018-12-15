// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockConfig, mockState } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

it('does not show button', async () => {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockState('renderer', { primaryRendererId: null, renderers: {} });
  mockState('router', { urlParams: {} });

  loadPlugins();
  const { queryByText } = render(<Slot name="header-buttons" />);

  expect(queryByText(/responsive/i)).toBeNull();
});
