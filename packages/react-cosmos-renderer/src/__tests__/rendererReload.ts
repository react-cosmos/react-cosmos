import { waitFor } from '@testing-library/react';
import { uuid } from 'react-cosmos-core';
import { vi } from 'vitest';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const onReloadRenderer = vi.fn();
const fixtures = wrapDefaultExport({
  first: { one: 'First' },
  second: 'Second',
});

beforeEach(onReloadRenderer.mockClear);

testRenderer(
  'reloads renderer',
  { rendererId, fixtures, reloadRenderer: onReloadRenderer },
  async ({ reloadRenderer }) => {
    reloadRenderer({ rendererId });
    await waitFor(() => expect(onReloadRenderer).toBeCalled());
  }
);
