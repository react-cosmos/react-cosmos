import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { uuid } from 'react-cosmos-core';
import { FixtureContext } from '../fixture/FixtureContext.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

function MyComponent() {
  const { setFixtureState } = React.useContext(FixtureContext);

  function setCustomState() {
    setFixtureState(() => ({ props: [], customFixtureState: true }));
  }

  function clearCustomState() {
    setFixtureState(() => ({ props: [] }));
  }

  return (
    <>
      <button onClick={setCustomState}>Set custom state</button>
      <button onClick={clearCustomState}>Clear custom state</button>
    </>
  );
}

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: MyComponent,
});

testRenderer(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first' },
      fixtureState: { props: [] },
    });

    await waitFor(() => expect(renderer.getByText('Set custom state')));
    fireEvent.click(renderer.getByText('Set custom state'));
    await fixtureStateChange({
      rendererId,
      fixtureId: { path: 'first' },
      fixtureState: { props: [], customFixtureState: true },
    });

    // Catches regression where changed state wouldn't be properly handled
    // Fixed in https://github.com/react-cosmos/react-cosmos/pull/1008
    fireEvent.click(renderer.getByText('Clear custom state'));
    await fixtureStateChange({
      rendererId,
      fixtureId: { path: 'first' },
      fixtureState: { props: [] },
    });
  }
);
