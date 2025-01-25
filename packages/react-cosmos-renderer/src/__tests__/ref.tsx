import { waitFor } from '@testing-library/react';
import React, { RefCallback } from 'react';
import { uuid } from 'react-cosmos-core';
import { HelloMessageCls } from '../testHelpers/components.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();

const cbRefCleanup = vi.fn();
const cbRef = vi.fn<RefCallback<unknown>>(() => cbRefCleanup);
const refObj = { current: null };

beforeEach(() => {
  cbRefCleanup.mockClear();
  cbRef.mockClear();
  refObj.current = null;
});

const getFixtures = () =>
  wrapDefaultExport({
    cb: <HelloMessageCls ref={cbRef} />,
    obj: <HelloMessageCls ref={refObj} />,
  });

testRenderer(
  'calls callback ref & cleanup',
  { rendererId, fixtures: getFixtures() },
  async ({ selectFixture, unselectFixture }) => {
    selectFixture({ rendererId, fixtureId: { path: 'cb' }, fixtureState: {} });
    await waitFor(() => expect(cbRef).toHaveBeenCalledTimes(1));
    expect(cbRef).toHaveBeenCalledWith(expect.any(HelloMessageCls));
    unselectFixture({ rendererId });
    await waitFor(() => expect(cbRefCleanup).toHaveBeenCalled());
  }
);

testRenderer(
  'sets & unsets ref object value',
  { rendererId, fixtures: getFixtures() },
  async ({ selectFixture, unselectFixture }) => {
    selectFixture({ rendererId, fixtureId: { path: 'obj' }, fixtureState: {} });
    await waitFor(() => expect(refObj.current).toBeInstanceOf(HelloMessageCls));
    unselectFixture({ rendererId });
    await waitFor(() => expect(refObj.current).toBeNull());
  }
);
