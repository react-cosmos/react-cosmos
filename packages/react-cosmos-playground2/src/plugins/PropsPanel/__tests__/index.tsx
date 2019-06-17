import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { ArraySlot, loadPlugins } from 'react-plugin';
import {
  FixtureStateValues,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockRendererCore,
  mockRouter,
  mockStorage
} from '../../../testHelpers/pluginMocks';
import { getParentButton } from '../../../testHelpers/selectors';
import { PROPS_TREE_EXPANSION_STORAGE_KEY } from '../shared';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo.js', name: null })
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="controlPanelRow" />);
}

function mockFsPropsValues(values: FixtureStateValues) {
  let updatedFixtureState: FixtureState = {
    props: [
      {
        elementId: { decoratorId: 'root', elPath: '' },
        renderKey: 0,
        componentName: 'MyComponent',
        values
      }
    ]
  };
  mockRendererCore({
    isValidFixtureSelected: () => true,
    getFixtureState: () => updatedFixtureState,
    setFixtureState: (context, stateUpdater) => {
      updatedFixtureState.props = stateUpdater(updatedFixtureState).props;
    }
  });
  return { updatedFixtureState };
}

it('renders blank state', async () => {
  registerTestPlugins();
  mockStorage();
  mockFsPropsValues({});

  const { getByText } = loadTestPlugins();
  getByText(/no visible props/i);
});

it('renders component name', async () => {
  registerTestPlugins();
  mockStorage();
  mockFsPropsValues({
    myValue: { type: 'primitive', value: 'foo' }
  });

  const { getByText } = loadTestPlugins();
  getByText('MyComponent');
});

it('updates string value', async () => {
  registerTestPlugins();
  mockStorage();
  const { updatedFixtureState } = mockFsPropsValues({
    myValue: { type: 'primitive', value: 'foo' }
  });

  const { getByLabelText } = loadTestPlugins();
  const input = getByLabelText('myValue');

  fireEvent.change(input, { target: { value: 'bar' } });
  await wait(() =>
    expect(updatedFixtureState.props![0].values).toEqual({
      myValue: { type: 'primitive', value: 'bar' }
    })
  );
});

it('toggles nested object', async () => {
  registerTestPlugins();
  const { setItem } = mockStorage();
  mockFsPropsValues({
    myObjValue: {
      type: 'object',
      values: {
        myNumValue: { type: 'primitive', value: 1234 }
      }
    }
  });

  const { getByText } = loadTestPlugins();
  fireEvent.click(getParentButton(getByText('myObjValue')));

  expect(setItem).toBeCalledWith(
    expect.any(Object),
    PROPS_TREE_EXPANSION_STORAGE_KEY,
    { 'foo.js': { root: { myObjValue: true } } }
  );
});

it('updates number input nested in object', async () => {
  registerTestPlugins();
  mockStorage({
    getItem: (context, key) =>
      key === PROPS_TREE_EXPANSION_STORAGE_KEY
        ? { 'foo.js': { root: { myObjValue: true } } }
        : null
  });
  const { updatedFixtureState } = mockFsPropsValues({
    myObjValue: {
      type: 'object',
      values: {
        myNumValue: { type: 'primitive', value: 1234 }
      }
    }
  });

  const { getByLabelText } = loadTestPlugins();
  const input = getByLabelText('myNumValue');

  fireEvent.change(input, { target: { value: 6789 } });
  await wait(() =>
    expect(updatedFixtureState.props![0].values).toEqual({
      myObjValue: {
        type: 'object',
        values: {
          myNumValue: { type: 'primitive', value: 6789 }
        }
      }
    })
  );
});
