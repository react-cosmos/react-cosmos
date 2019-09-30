import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { RendererHeader } from './RendererHeader';

const propDefaults = {
  fixtureId: { path: 'foo', name: null },
  panelOpen: false,
  navOpen: false,
  rendererActionOrder: [],
  onToggleNav: () => {},
  onTogglePanel: () => {},
  onReload: () => {},
  onClose: () => {}
};

it('renders toggle nav button', async () => {
  const onToggleNav = jest.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onToggleNav={onToggleNav} />
  );

  fireEvent.click(getByTitle(/toggle fixture list/i));
  expect(onToggleNav).toBeCalled();
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
  const onReload = jest.fn();
  const { getByTitle } = render(
    <RendererHeader {...propDefaults} onReload={onReload} />
  );

  fireEvent.click(getByTitle(/reload fixture/i));
  expect(onReload).toBeCalled();
});
