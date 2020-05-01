import React from 'react';
import {
  createFixtureTree,
  flattenFixtureTree,
} from 'react-cosmos-shared2/fixtureTree';
import { fixtures } from '../../testHelpers/dataMocks';
import { RendererHeader } from './RendererHeader';

const fixtureTree = createFixtureTree({
  fixtures,
  fixturesDir: '__fixtures__',
  fixtureFileSuffix: 'fixture',
});
const fixtureItems = flattenFixtureTree(fixtureTree);

export default (
  <RendererHeader
    fixtureItems={fixtureItems}
    fixtureId={{
      path: 'src/plugins/Notifications/index.fixture.tsx',
      name: 'multiple',
    }}
    panelOpen={false}
    navOpen={false}
    rendererActionOrder={[]}
    onOpenNav={() => {}}
    onTogglePanel={() => {}}
    onFixtureSelect={() => {}}
    onClose={() => {}}
  />
);
