import retry from '@skidding/async-retry';
import React from 'react';
import { ReactTestRenderer } from 'react-test-renderer';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';
import { useSelect } from '../useSelect';

const options = {
  first: 'First option',
  second: 'Second option',
  third: 'Third option',
};

type Option = keyof typeof options;

function createFixtures({ defaultValue }: { defaultValue: Option }) {
  const MyComponent = () => {
    const [value, setValue] = useSelect('selectName', {
      defaultValue,
      options,
    });
    return (
      <input
        type="text"
        value={options[value]}
        onChange={e => setValue(e.target.value as Option)}
      />
    );
  };
  return {
    first: <MyComponent />,
  };
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: 'first' });
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'First option');
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
        selects: {
          selectName: {
            options: ['first', 'second', 'third'],
            defaultValue: 'first',
            currentValue: 'first',
          },
        },
      },
    });
  }
);

testFixtureLoader(
  'reflects fixture state change',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'First option');
    const fixtureState = await getLastFixtureState();
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        ...setFixtureState,
        selects: {
          ...fixtureState.selects,
          selectName: {
            options: ['first', 'second', 'third'],
            defaultValue: 'first',
            currentValue: 'second',
          },
        },
      },
    });
    await rendered(renderer, 'Second option');
  }
);

testFixtureLoader(
  'updates fixture state via setter',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'First option');
    changeValue(renderer, 'second');
    await rendered(renderer, 'Second option');
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        selects: {
          selectName: {
            options: ['first', 'second', 'third'],
            defaultValue: 'first',
            currentValue: 'second',
          },
        },
      },
    });
  }
);

testFixtureLoader(
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'First option');
    update({
      rendererId,
      fixtures: createFixtures({ defaultValue: 'third' }),
    });
    await rendered(renderer, 'Third option');
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        selects: {
          selectName: {
            options: ['first', 'second', 'third'],
            defaultValue: 'third',
            currentValue: 'third',
          },
        },
      },
    });
  }
);

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => expect(renderer.toJSON()!.props.value).toEqual(text));
}

function changeValue(renderer: ReactTestRenderer, value: Option) {
  renderer.toJSON()!.props.onChange({ target: { value } });
}
