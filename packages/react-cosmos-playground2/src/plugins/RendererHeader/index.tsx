import React from 'react';
import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RendererHeaderSpec } from './public';
import { RendererHeader } from './RendererHeader';

const { plug, register } = createPlugin<RendererHeaderSpec>({
  name: 'rendererHeader'
});

plug('rendererHeader', ({ pluginContext: { getMethodsOf } }) => {
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  return (
    <RendererHeader
      selectedFixtureId={router.getSelectedFixtureId()}
      rendererConnected={rendererCore.isRendererConnected()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      selectFixture={router.selectFixture}
      unselectFixture={router.unselectFixture}
    />
  );
});

export { register };
