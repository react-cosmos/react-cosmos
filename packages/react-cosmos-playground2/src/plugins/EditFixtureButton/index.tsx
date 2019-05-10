import React from 'react';
import { createPlugin } from 'react-plugin';
import { createArrayPlug } from '../../shared/slot';
import { CoreSpec } from './../Core/public';
import { RouterSpec } from './../Router/public';
import { EditFixtureButton, EditFixtureButtonProps } from './EditFixtureButton';
import { EditFixtureButtonSpec } from './public';

const { plug, register } = createPlugin<EditFixtureButtonSpec>({
  name: 'editFixtureButton'
});

const FixtureActionsPlug = createArrayPlug<EditFixtureButtonProps>(
  'fixtureActions',
  EditFixtureButton
);

plug('fixtureActions', ({ pluginContext: { getMethodsOf } }) => {
  const core = getMethodsOf<CoreSpec>('core');
  const router = getMethodsOf<RouterSpec>('router');
  return (
    <FixtureActionsPlug
      devServerOn={core.isDevServerOn()}
      selectedFixtureId={router.getSelectedFixtureId()}
    />
  );
});

export { register };
