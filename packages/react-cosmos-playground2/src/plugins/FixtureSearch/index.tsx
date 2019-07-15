import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { FixtureSearchButton } from './FixtureSearchButton';
import { FixtureSearchOverlay } from './FixtureSearchOverlay';
import { FixtureSearchSpec } from './public';

const { namedPlug, register } = createPlugin<FixtureSearchSpec>({
  name: 'fixtureSearch',
  initialState: {
    open: false
  }
});

namedPlug('navRow', 'fixtureSearch', ({ pluginContext }) => {
  const { getMethodsOf, setState } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();
  const onOpen = React.useCallback(() => setState({ open: true }), [setState]);

  if (Object.keys(fixtures).length === 0) {
    return null;
  }

  return <FixtureSearchButton onOpen={onOpen} />;
});

namedPlug('global', 'fixtureSearch', ({ pluginContext }) => {
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
