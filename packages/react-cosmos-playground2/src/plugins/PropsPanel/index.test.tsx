import { fireEvent, render, wait } from '@testing-library/react';
import React from 'react';
import {
  FixtureState,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '.';
import { ControlPanelRowSlot } from '../../shared/slots/ControlPanelRowSlot';
import { mockStorage } from '../../testHelpers/pluginMocks';
import { getParentButton } from '../../testHelpers/selectors';
import { PROPS_TREE_EXPANSION_STORAGE_KEY } from './shared';

afterEach(resetPlugins);

function loadTestPlugins(fixtureState: FixtureState) {
  loadPlugins();
  return render(
    <ControlPanelRowSlot
      slotProps={{
        fixtureId: { path: 'foo.js', name: null },
        fixtureState,
        onFixtureStateChange: stateUpdater => {
          fixtureState.props = stateUpdater(fixtureState).props;
        }
      }}
      plugOrder={[]}
    />
  );
}

it('renders blank state', async () => {
  register();
  mockStorage();

  const fixtureState = createFsState({});
  const { getByText } = loadTestPlugins(fixtureState);
  getByText(/no visible props/i);
});

it('renders component name', async () => {
  register();
  mockStorage();

  const fixtureState = createFsState({
    myValue: { type: 'primitive', value: 'foo' }
  });
  const { getByText } = loadTestPlugins(fixtureState);
  getByText('MyComponent');
});

it('updates string value', async () => {
  register();
  mockStorage();

  const fixtureState = createFsState({
    myStrValue: { type: 'primitive', value: 'foo' }
  });
  const { getByLabelText } = loadTestPlugins(fixtureState);
  const input = getByLabelText('myStrValue');

  fireEvent.change(input, { target: { value: 'bar' } });
  await wait(() =>
    expect(fixtureState.props[0].values).toEqual({
      myStrValue: { type: 'primitive', value: 'bar' }
    })
  );
});

it('updates boolean value', async () => {
  register();
  mockStorage();

  const fixtureState = createFsState({
    myBoolValue: { type: 'primitive', value: false }
  });
  const { getByText } = loadTestPlugins(fixtureState);
  getByText('myBoolValue');
  const button = getByText('false');

  fireEvent.click(button);
  await wait(() =>
    expect(fixtureState.props[0].values).toEqual({
      myBoolValue: { type: 'primitive', value: true }
    })
  );
});

it('renders null value', async () => {
  register();
  mockStorage();

  const fixtureState = createFsState({
    myNullValue: { type: 'primitive', value: null }
  });
  const { getByText } = loadTestPlugins(fixtureState);
  getByText('myNullValue');
  getByText('null');
});

it('renders unserializable value', async () => {
  register();
  mockStorage();

  const fixtureState = createFsState({
    myRegexpValue: {
      type: 'unserializable',
      stringifiedValue: '/canttouchthis/i'
    }
  });
  const { getByText } = loadTestPlugins(fixtureState);
  getByText('myRegexpValue');
  getByText('/canttouchthis/i');
});

it('toggles nested object', async () => {
  register();
  const { setItem } = mockStorage();

  const fixtureState = createFsState({
    myObjValue: {
      type: 'object',
      values: {
        myNumValue: { type: 'primitive', value: 1234 }
      }
    }
  });
  const { getByText } = loadTestPlugins(fixtureState);
  fireEvent.click(getParentButton(getByText('myObjValue')));

  expect(setItem).toBeCalledWith(
    expect.any(Object),
    PROPS_TREE_EXPANSION_STORAGE_KEY,
    { 'foo.js': { root: { myObjValue: true } } }
  );
});

it('updates number input nested in object', async () => {
  register();
  mockStorage({
    getItem: (context, key) =>
      key === PROPS_TREE_EXPANSION_STORAGE_KEY
        ? { 'foo.js': { root: { myObjValue: true } } }
        : null
  });

  const fixtureState = createFsState({
    myObjValue: {
      type: 'object',
      values: {
        myNumValue: { type: 'primitive', value: 1234 }
      }
    }
  });
  const { getByLabelText } = loadTestPlugins(fixtureState);
  const input = getByLabelText('myNumValue');

  fireEvent.change(input, { target: { value: 6789 } });
  await wait(() =>
    expect(fixtureState.props[0].values).toEqual({
      myObjValue: {
        type: 'object',
        values: {
          myNumValue: { type: 'primitive', value: 6789 }
        }
      }
    })
  );
});

function createFsState(propsValues: FixtureStateValues) {
  return {
    props: [
      {
        elementId: { decoratorId: 'root', elPath: '' },
        renderKey: 0,
        componentName: 'MyComponent',
        values: propsValues
      }
    ]
  };
}
