import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from './../Core/public';
import { RouterSpec } from './../Router/public';
import { EditFixtureButton } from './EditFixtureButton';
import { EditFixtureButtonSpec } from './public';

const { plug, register } = createPlugin<EditFixtureButtonSpec>({
  name: 'editFixtureButton'
});

plug('fixtureActions', ({ pluginContext: { getMethodsOf } }) => {
  const core = getMethodsOf<CoreSpec>('core');
  const router = getMethodsOf<RouterSpec>('router');
  return (
    <EditFixtureButton
      devServerOn={core.isDevServerOn()}
      selectedFixtureId={router.getSelectedFixtureId()}
    />
  );
});

export { register };
