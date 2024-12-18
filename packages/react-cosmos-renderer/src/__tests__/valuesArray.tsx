import { waitFor } from '@testing-library/react';
import React from 'react';
import { createValue, uuid } from 'react-cosmos-core';
import { useFixtureInput } from '../fixture/useFixtureInput/useFixtureInput.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

type Profile = {
  isAdmin: boolean;
  name: string;
  age: number;
  onClick: () => unknown;
};

function createFixtures({ defaultValue }: { defaultValue: Profile[] }) {
  const MyComponent = () => {
    const [profiles] = useFixtureInput('profiles', defaultValue);
    return JSON.stringify(profiles);
  };
  return wrapDefaultExport({
    first: <MyComponent />,
  });
}

const rendererId = uuid();
const fixtures = createFixtures({
  defaultValue: [{ isAdmin: true, name: 'Pat D', age: 45, onClick: () => {} }],
});
const fixtureId = { path: 'first' };

testRenderer(
  'renders fixture',
  { rendererId, fixtures },
  async ({ rootText, selectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => {
      expect(rootText()).toBe(
        JSON.stringify([{ isAdmin: true, name: 'Pat D', age: 45 }])
      );
    });
  }
);

testRenderer(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          profiles: {
            type: 'standard',
            defaultValue: createValue([
              { isAdmin: true, name: 'Pat D', age: 45, onClick: () => {} },
            ]),
            currentValue: createValue([
              { isAdmin: true, name: 'Pat D', age: 45, onClick: () => {} },
            ]),
          },
        },
      },
    });
  }
);

testRenderer(
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    update({
      rendererId,
      fixtures: createFixtures({
        defaultValue: [
          { isAdmin: false, name: 'Pat D', age: 45, onClick: () => {} },
          { isAdmin: true, name: 'Dan B', age: 39, onClick: () => {} },
        ],
      }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          profiles: {
            type: 'standard',
            defaultValue: createValue([
              { isAdmin: false, name: 'Pat D', age: 45, onClick: () => {} },
              { isAdmin: true, name: 'Dan B', age: 39, onClick: () => {} },
            ]),
            currentValue: createValue([
              { isAdmin: false, name: 'Pat D', age: 45, onClick: () => {} },
              { isAdmin: true, name: 'Dan B', age: 39, onClick: () => {} },
            ]),
          },
        },
      },
    });
  }
);
