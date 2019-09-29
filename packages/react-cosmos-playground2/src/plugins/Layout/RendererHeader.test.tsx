import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { RendererHeader } from './RendererHeader';

it('renders toggle nav button', async () => {
  const onToggleNav = jest.fn();
  const { getByTitle } = render(
    <RendererHeader
      fixtureId={{ path: 'foo', name: null }}
      panelOpen={false}
      navOpen={false}
      rendererActionOrder={[]}
      onToggleNav={onToggleNav}
      onTogglePanel={() => {}}
      onReload={() => {}}
      onClose={() => {}}
    />
  );

  fireEvent.click(getByTitle(/toggle fixture list/i));
  expect(onToggleNav).toBeCalled();
});

it('renders toggle panel button', async () => {
  const onTogglePanel = jest.fn();
  const { getByTitle } = render(
    <RendererHeader
      fixtureId={{ path: 'foo', name: null }}
      panelOpen={false}
      navOpen={false}
      rendererActionOrder={[]}
      onToggleNav={() => {}}
      onTogglePanel={onTogglePanel}
      onReload={() => {}}
      onClose={() => {}}
    />
  );

  fireEvent.click(getByTitle(/toggle control panel/i));
  expect(onTogglePanel).toBeCalled();
});

it('renders close button', async () => {
  const onClose = jest.fn();
  const { getByTitle } = render(
    <RendererHeader
      fixtureId={{ path: 'foo', name: null }}
      navOpen={false}
      panelOpen={false}
      rendererActionOrder={[]}
      onToggleNav={() => {}}
      onTogglePanel={() => {}}
      onReload={() => {}}
      onClose={onClose}
    />
  );

  fireEvent.click(getByTitle(/close fixture/i));
  expect(onClose).toBeCalled();
});

it('renders reload button', async () => {
  const onReload = jest.fn();
  const { getByTitle } = render(
    <RendererHeader
      fixtureId={{ path: 'foo', name: null }}
      navOpen={false}
      panelOpen={false}
      rendererActionOrder={[]}
      onToggleNav={() => {}}
      onTogglePanel={() => {}}
      onReload={onReload}
      onClose={() => {}}
    />
  );

  fireEvent.click(getByTitle(/reload fixture/i));
  expect(onReload).toBeCalled();
});
