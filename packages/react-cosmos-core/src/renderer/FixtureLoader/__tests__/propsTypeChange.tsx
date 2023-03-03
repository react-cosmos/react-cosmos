import retry from '@skidding/async-retry';
import React from 'react';
import { createValues } from '../../../fixtureState/createValues.js';
import { updateFixtureStateProps } from '../../../fixtureState/props.js';
import { uuid } from '../../../utils/uuid.js';
import { getProps } from '../testHelpers/fixtureState.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = createFixtures();
const fixtureId = { path: 'first' };

function createFixtures() {
  function HelloMessage({ name }: { name: string }) {
    return <>{`Hello ${name}`}</>;
  }
  return wrapFixtures({
    first: <HelloMessage name="Theo" />,
  });
}

testFixtureLoader(
  'persists props after type changes reference but keeps name (hmr simulation)',
  { rendererId, fixtures },
  async ({
    renderer,
    update,
    selectFixture,
    getLastFixtureState,
    setFixtureState,
  }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await retry(() => expect(renderer.toJSON()).toBe('Hello Theo'));
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: createValues({ name: 'Theo Von' }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello Theo Von'));
    update({ rendererId, fixtures: createFixtures() });
    await retry(() => expect(renderer.toJSON()).toBe('Hello Theo Von'));
  }
);
