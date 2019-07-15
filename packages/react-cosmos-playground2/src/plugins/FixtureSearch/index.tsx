import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { FixtureSearchOverlay } from './FixtureSearchOverlay';
import { FixtureSearchSpec } from './public';

const { plug, register } = createPlugin<FixtureSearchSpec>({
  name: 'fixtureSearch',
  initialState: {
    open: false
  }
});

plug('navRow', ({ pluginContext }) => {
  const { getMethodsOf, setState } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();

  if (Object.keys(fixtures).length === 0) {
    return null;
  }

  return (
    <button onClick={() => setState({ open: true })}>Search fixtures</button>
  );
});

plug('global', ({ pluginContext }) => {
  const { getState, setState, getMethodsOf } = pluginContext;
  const { open } = getState();
  const core = getMethodsOf<CoreSpec>('core');
  const router = getMethodsOf<RouterSpec>('router');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();
  const onClose = React.useCallback(() => setState({ open: false }), [
    setState
  ]);
  const onSelect = React.useCallback(
    (fixtureId: FixtureId) => {
      router.selectFixture(fixtureId, false);
      setState({ open: false });
    },
    [router, setState]
  );

  if (!open) {
    return null;
  }

  return (
    <FixtureSearchOverlay
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
});

export { register };
