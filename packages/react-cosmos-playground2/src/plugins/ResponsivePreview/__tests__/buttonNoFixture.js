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
  mockState('rendererCoordinator', { fixtureState: null });
  mockMethod('rendererCoordinator.isValidFixtureSelected', () => false);

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  expect(getByText(/responsive/i)).toHaveAttribute('disabled');
});
