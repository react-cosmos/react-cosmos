import * as React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { StorageSpec } from '../../Storage/public';
import { CoreSpec } from '../../Core/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

it('renders disabled button', async () => {
  register();
  mockMethodsOf<StorageSpec>('storage', {});
  mockMethodsOf<CoreSpec>('core', {
    getProjectId: () => 'mockProjectId'
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getFixtureState: () => null,
    isValidFixtureSelected: () => false
  });

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  expect(getByText(/responsive/i)).toHaveAttribute('disabled');
});
