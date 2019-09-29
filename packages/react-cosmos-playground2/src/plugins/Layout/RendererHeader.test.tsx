import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { RendererHeader } from './RendererHeader';

it('renders toggle nav button', async () => {
  const onToggleNav = jest.fn();
  const { getByTitle } = render(
    <RendererHeader
      fixtureId={{ path: 'foo', name: null }}
      navOpen={false}
      rendererActionOrder={[]}
      onToggleNav={onToggleNav}
      onReload={() => {}}
      onClose={() => {}}
    />
  );

  fireEvent.click(getByTitle(/toggle fixture list/i));
  expect(onToggleNav).toBeCalled();
});

it('renders close button', async () => {
  const onClose = jest.fn();
  const { getByTitle } = render(
    <RendererHeader
      fixtureId={{ path: 'foo', name: null }}
      navOpen={false}
      rendererActionOrder={[]}
      onToggleNav={() => {}}
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
      rendererActionOrder={[]}
      onToggleNav={() => {}}
      onReload={onReload}
      onClose={() => {}}
    />
  );

  fireEvent.click(getByTitle(/reload fixture/i));
  expect(onReload).toBeCalled();
});
