import retry from '@skidding/async-retry';
import React from 'react';
import { ReactTestRenderer } from 'react-test-renderer';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';
import { useSelect } from '../useSelect';

function createFixtures() {
  const MyComponent = () => {
    const [value, setValue] = useSelect('selectName', {
      options: ['first', 'second', 'third'],
    });
    return (
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value as typeof value)}
      />
    );
  };
  return {
    first: <MyComponent />,
  };
}

const rendererId = uuid();
const fixtures = createFixtures();
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'first');
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
        controls: {
          selectName: {
            type: 'select',
            options: ['first', 'second', 'third'],
            defaultValue: 'first',
            currentValue: 'first',
          },
        },
      },
    });
  }
);

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => expect(renderer.toJSON()!.props.value).toEqual(text));
}
