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
  navPanelOpen: false,
  controlPanelOpen: false,
  panelsLocked: true,
  fixtureActionOrder: [],
  rendererActionOrder: [],
  onToggleNavPanel: () => {},
  onToggleControlPanel: () => {},
  onReloadRenderer: () => {},
  onClose: () => {},
};

it('renders show nav panel button', async () => {
  const onToggleNavPanel = vi.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onToggleNavPanel={onToggleNavPanel} />
  );

  fireEvent.click(getByTitle(/show nav panel/i));
  expect(onToggleNavPanel).toBeCalled();
});

it('renders show panel panel button', async () => {
  const onToggleControlPanel = vi.fn();
  const { getByTitle } = render(
    <RendererHeader
      {...propDefaults}
      onToggleControlPanel={onToggleControlPanel}
    />
  );

  fireEvent.click(getByTitle(/show control panel/i));
  expect(onToggleControlPanel).toBeCalled();
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
