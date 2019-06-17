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
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockStorage();
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
  mockFsPropsValues({});

  const { getByText } = loadTestPlugins();
  getByText(/no visible props/i);
});

it('renders component name', async () => {
  registerTestPlugins();
  mockFsPropsValues({
    myValue: { type: 'primitive', value: 'foo' }
  });

  const { getByText } = loadTestPlugins();
  getByText('MyComponent');
});

it('renders string input', async () => {
  registerTestPlugins();
  mockFsPropsValues({
    myValue: { type: 'primitive', value: 'foo' }
  });

  const { getByLabelText } = loadTestPlugins();
  const input = getByLabelText('myValue');
  expect((input as HTMLTextAreaElement).value).toBe('foo');
});

it('updates string value', async () => {
  registerTestPlugins();
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
