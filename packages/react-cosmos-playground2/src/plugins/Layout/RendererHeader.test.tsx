import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { RendererHeader } from './RendererHeader';

it('renders close button', async () => {
  const onClose = jest.fn();
  const { getByTitle } = render(
    <RendererHeader
      fixtureId={{ path: 'foo', name: null }}
      rendererActionOrder={[]}
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
      rendererActionOrder={[]}
      onReload={onReload}
      onClose={() => {}}
    />
  );

  fireEvent.click(getByTitle(/reload fixture/i));
  expect(onReload).toBeCalled();
});
