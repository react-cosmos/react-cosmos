import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { ReactTestRenderer } from 'react-test-renderer';
// Warning: Import test helpers before tested source to mock Socket.IO
import { runFixtureLoaderTests } from '../testHelpers';
import { resetPersistentValues } from '../stateHooks/shared/persistentValueStore';
import { useString } from '..';

function createFixtures(inputName: string, defaultValue: string) {
  const MyComponent = () => {
    const [value, setValue] = useString(inputName, { defaultValue });
    return (
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  };
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures('name', 'Fu Barr');
const decorators = {};
const fixtureId = { path: 'first', name: null };

afterEach(resetPersistentValues);

runFixtureLoaderTests(mount => {
  it('renders fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, 'Fu Barr');
      }
    );
  });

  it('creates fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              name: {
                type: 'primitive',
                defaultValue: 'Fu Barr',
                currentValue: 'Fu Barr'
              }
            }
          }
        });
      }
    );
  });

  it('updates fixture state via setter', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, 'Fu Barr');
        changeInput(renderer, 'Fu Barr Beaz');
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              name: {
                type: 'primitive',
                defaultValue: 'Fu Barr',
                currentValue: 'Fu Barr Beaz'
              }
            }
          }
        });
      }
    );
  });

  it('resets fixture state on default value change in component', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, 'Fu Barr');
        update({
          rendererId,
          fixtures: createFixtures('name', 'Fu Barr Beaz Cooks'),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              name: {
                type: 'primitive',
                defaultValue: 'Fu Barr Beaz Cooks',
                currentValue: 'Fu Barr Beaz Cooks'
              }
            }
          }
        });
      }
    );
  });
});

function getButtonText(renderer: ReactTestRenderer) {
  return renderer.toJSON()!.props.value;
}

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => Boolean(renderer.toJSON()));
  await retry(() => expect(getButtonText(renderer)).toEqual(text));
}

function changeInput(renderer: ReactTestRenderer, value: string) {
  renderer.toJSON()!.props.onChange({ target: { value } });
}
