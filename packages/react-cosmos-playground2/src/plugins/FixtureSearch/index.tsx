import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin } from 'react-plugin';
import { KEY_K, KEY_P } from '../../shared/keys';
import { CoreSpec } from '../Core/public';
import { FixtureTreeSpec } from '../FixtureTree/public';
import { LayoutSpec } from '../Layout/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { FixtureSearchHeader } from './FixtureSearchHeader';
import { FixtureSearchOverlay } from './FixtureSearchOverlay';
import { FixtureSearchSpec } from './public';

const { onLoad, namedPlug, register } = createPlugin<FixtureSearchSpec>({
  name: 'fixtureSearch',
  initialState: {
    open: false
  }
});

onLoad(({ setState }) => {
  function handleWindowKeyDown(e: KeyboardEvent) {
    const metaKey = e.metaKey || e.ctrlKey;
    if (metaKey && (e.keyCode === KEY_P || e.keyCode === KEY_K)) {
      e.preventDefault();
      setState({ open: true });
    }
  }
  window.addEventListener('keydown', handleWindowKeyDown);
  return () => window.removeEventListener('keydown', handleWindowKeyDown);
});

namedPlug('navRow', 'fixtureSearch', ({ pluginContext }) => {
  const { getMethodsOf, setState } = pluginContext;
  const layout = getMethodsOf<LayoutSpec>('layout');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();
  const onOpen = React.useCallback(() => setState({ open: true }), [setState]);
  const onMinimizeNav = React.useCallback(() => layout.openNav(false), [
    layout
  ]);

  if (Object.keys(fixtures).length === 0) {
    return null;
  }

  return <FixtureSearchHeader onOpen={onOpen} onMinimizeNav={onMinimizeNav} />;
});

namedPlug('global', 'fixtureSearch', ({ pluginContext }) => {
  const { getState, setState, getMethodsOf } = pluginContext;
  const { open } = getState();
  const core = getMethodsOf<CoreSpec>('core');
  const router = getMethodsOf<RouterSpec>('router');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureTree = getMethodsOf<FixtureTreeSpec>('fixtureTree');
  const fixtures = rendererCore.getFixtures();
  const onClose = React.useCallback(() => setState({ open: false }), [
    setState
  ]);
  const onSelect = React.useCallback(
    (fixtureId: FixtureId, revealFixture: boolean) => {
      router.selectFixture(fixtureId, false);
      if (revealFixture) {
        fixtureTree.revealFixture(fixtureId);
      }
      setState({ open: false });
    },
    [fixtureTree, router, setState]
  );

  if (!open) {
    return null;
  }

  return (
    <FixtureSearchOverlay
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={router.getSelectedFixtureId()}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
});

export { register };
