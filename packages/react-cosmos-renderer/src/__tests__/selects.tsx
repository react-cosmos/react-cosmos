import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { uuid } from 'react-cosmos-core';
import { useFixtureSelect } from '../fixture/useFixtureSelect/useFixtureSelect.js';
import { getInputs } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

type Option = 'first' | 'second' | 'third';

const options: Option[] = ['first', 'second', 'third'];

function createFixtures({ defaultValue }: { defaultValue: Option }) {
  const MyComponent = () => {
    const [value, setValue] = useFixtureSelect('selectName', {
      defaultValue,
      options,
    });
    return (
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value as Option)}
      />
    );
  };
  return wrapDefaultExport({
    first: <MyComponent />,
  });
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: 'first' });
const fixtureId = { path: 'first' };

testRenderer(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() =>
      expect(renderer.getByRole('textbox')).toHaveValue('first')
    );
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

testRenderer(
  'reflects fixture state change',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() =>
      expect(renderer.getByRole('textbox')).toHaveValue('first')
    );
    const fixtureState = await getLastFixtureState();
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        ...setFixtureState,
        inputs: {
          ...getInputs(fixtureState),
          selectName: {
            type: 'select',
            options: ['first', 'second', 'third'],
            defaultValue: 'first',
            currentValue: 'second',
          },
        },
      },
    });
    await waitFor(() =>
      expect(renderer.getByRole('textbox')).toHaveValue('second')
    );
  }
);

testRenderer(
  'updates fixture state via setter',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() =>
      expect(renderer.getByRole('textbox')).toHaveValue('first')
    );
    fireEvent.change(renderer.getByRole('textbox'), {
      target: { value: 'second' },
    });
    await waitFor(() =>
      expect(renderer.getByRole('textbox')).toHaveValue('second')
    );
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          selectName: {
            type: 'select',
            options: ['first', 'second', 'third'],
            defaultValue: 'first',
            currentValue: 'second',
          },
        },
      },
    });
  }
);

testRenderer(
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() =>
      expect(renderer.getByRole('textbox')).toHaveValue('first')
    );
    update({
      rendererId,
      fixtures: createFixtures({ defaultValue: 'third' }),
    });
    await waitFor(() =>
      expect(renderer.getByRole('textbox')).toHaveValue('third')
    );
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          selectName: {
            type: 'select',
            options: ['first', 'second', 'third'],
            defaultValue: 'third',
            currentValue: 'third',
          },
        },
      },
    });
  }
);
