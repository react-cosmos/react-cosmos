import retry from '@skidding/async-retry';
import React from 'react';
import {
  createValues,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { HelloMessage } from '../testHelpers/components';
import { testFixtureLoader } from '../testHelpers';
import { anyProps, getProps } from '../testHelpers/fixtureState';

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <HelloMessage name="Bianca" />
      <HelloMessage name="B" />
    </>
  )
};
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'captures multiple props instances',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    await selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {}
    });
    await retry(() =>
      expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B'])
    );
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            componentName: 'HelloMessage',
            elPath: 'props.children[0]',
            values: createValues({ name: 'Bianca' })
          }),
          anyProps({
            componentName: 'HelloMessage',
            elPath: 'props.children[1]',
            values: createValues({ name: 'B' })
          })
        ]
      }
    });
  }
);

testFixtureLoader(
  'overwrites prop in second instance',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {}
    });
    const fixtureState = await getLastFixtureState();
    const [, { elementId }] = getProps(fixtureState, 2);
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: createValues({ name: 'Petec' })
        })
      }
    });
    await retry(() =>
      expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello Petec'])
    );
  }
);
