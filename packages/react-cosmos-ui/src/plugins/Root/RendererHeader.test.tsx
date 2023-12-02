import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { createFixtureTree, flattenFixtureTree } from 'react-cosmos-core';
import { vi } from 'vitest';
import { fixtures } from '../../testHelpers/dataMocks.js';
import { RendererHeader } from './RendererHeader.js';

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
  onReloadRenderer: () => {},
  onClose: () => {},
};

it('renders toggle nav button', async () => {
  const onOpenNav = vi.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onOpenNav={onOpenNav} />
  );

  fireEvent.click(getByTitle(/show fixture list/i));
  expect(onOpenNav).toBeCalled();
});

it('renders toggle panel button', async () => {
  const onTogglePanel = vi.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onTogglePanel={onTogglePanel} />
  );

  fireEvent.click(getByTitle(/toggle control panel/i));
  expect(onTogglePanel).toBeCalled();
});

it('renders close button', async () => {
  const onClose = vi.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onClose={onClose} />
  );

  fireEvent.click(getByTitle(/close fixture/i));
  expect(onClose).toBeCalled();
});

it('renders reload button', async () => {
  const onReloadRenderer = vi.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onReloadRenderer={onReloadRenderer} />
  );

  fireEvent.click(getByTitle(/reload fixture/i));
  expect(onReloadRenderer).toBeCalled();
});
