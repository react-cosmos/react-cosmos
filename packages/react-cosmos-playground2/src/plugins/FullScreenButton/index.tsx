import React from 'react';
import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { FullScreenButton } from './FullScreenButton';
import { FullScreenButtonSpec } from './public';

const { plug, register } = createPlugin<FullScreenButtonSpec>({
  name: 'fullScreenButton'
});

plug('rendererActions', ({ pluginContext: { getMethodsOf } }) => {
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  return (
    <FullScreenButton
      selectedFixtureId={router.getSelectedFixtureId()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      selectFixture={router.selectFixture}
    />
  );
});

export { register };
