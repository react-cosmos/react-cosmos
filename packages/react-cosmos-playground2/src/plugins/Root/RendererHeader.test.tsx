import { fireEvent, render } from '@testing-library/react';
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

const propDefaults = {
  fixtureItems,
  fixtureId: {
    path: 'src/plugins/Notifications/index.fixture.tsx',
    name: 'multiple',
  },
  panelOpen: false,
  navOpen: false,
  fixtureActionOrder: [],
  rendererActionOrder: [],
  onOpenNav: () => {},
  onTogglePanel: () => {},
  onFixtureSelect: () => {},
  onClose: () => {},
};

it('renders toggle nav button', async () => {
  const onOpenNav = jest.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onOpenNav={onOpenNav} />
  );

  fireEvent.click(getByTitle(/show fixture list/i));
  expect(onOpenNav).toBeCalled();
});

it('renders toggle panel button', async () => {
  const onTogglePanel = jest.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onTogglePanel={onTogglePanel} />
  );

  fireEvent.click(getByTitle(/toggle control panel/i));
  expect(onTogglePanel).toBeCalled();
});

it('renders close button', async () => {
  const onClose = jest.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onClose={onClose} />
  );

  fireEvent.click(getByTitle(/close fixture/i));
  expect(onClose).toBeCalled();
});

it('renders reload button', async () => {
  const onFixtureSelect = jest.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onFixtureSelect={onFixtureSelect} />
  );

  fireEvent.click(getByTitle(/reload fixture/i));
  expect(onFixtureSelect).toBeCalledWith(propDefaults.fixtureId);
});
