import retry from '@skidding/async-retry';
import React from 'react';
import { ReactTestRenderer } from 'react-test-renderer';
import { createValue } from '../../fixtureState';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';
import { useValue } from '../useValue';

function createFixtures({ defaultValue }: { defaultValue: number }) {
  const MyComponent = () => {
    const [count, setCount] = useValue('count', { defaultValue });
    return (
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        {count} clicks
      </button>
    );
  };
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: 0 });
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, '0 clicks');
  }
);

testFixtureLoader(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        values: {
          count: {
            defaultValue: createValue(0),
            currentValue: createValue(0)
          }
        }
      }
    });
  }
);

testFixtureLoader(
  'updates fixture state via setter',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, '0 clicks');
    clickButton(renderer);
    clickButton(renderer);
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        values: {
          count: {
            defaultValue: createValue(0),
            currentValue: createValue(2)
          }
        }
      }
    });
  }
);

testFixtureLoader(
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, '0 clicks');
    update({
      rendererId,
      fixtures: createFixtures({ defaultValue: 5 })
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        values: {
          count: {
            defaultValue: createValue(5),
            currentValue: createValue(5)
          }
        }
      }
    });
  }
);

function getButtonText(renderer: ReactTestRenderer) {
  return renderer.toJSON()!.children!.join('');
}

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => expect(getButtonText(renderer)).toEqual(text));
}

function clickButton(renderer: ReactTestRenderer) {
  renderer.toJSON()!.props.onClick();
}
