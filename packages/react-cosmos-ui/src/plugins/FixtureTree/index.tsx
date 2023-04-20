import React, { useCallback } from 'react';
import { createPlugin } from 'react-plugin';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RouterSpec } from '../Router/spec.js';
import { StorageSpec } from '../Storage/spec.js';
import { FixtureTreeContainer } from './FixtureTreeContainer.js';
import { revealFixture } from './revealFixture.js';
import { getTreeExpansion, setTreeExpansion } from './shared.js';
import { FixtureTreeSpec } from './spec.js';

const { namedPlug, register } = createPlugin<FixtureTreeSpec>({
  name: 'fixtureTree',
  methods: {
    revealFixture,
  },
});

namedPlug('navRow', 'fixtureTree', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');
  const router = getMethodsOf<RouterSpec>('router');
  const core = getMethodsOf<CoreSpec>('core');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const expansion = getTreeExpansion(storage);
  const setExpansionMemo = useCallback(
    (newExpansion: TreeExpansion) => setTreeExpansion(storage, newExpansion),
    [storage]
  );

  return (
    <FixtureTreeContainer
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      selectedFixtureId={router.getSelectedFixtureId()}
      fixtures={rendererCore.getFixtures()}
      expansion={expansion}
      selectFixture={router.selectFixture}
      setExpansion={setExpansionMemo}
    />
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();
