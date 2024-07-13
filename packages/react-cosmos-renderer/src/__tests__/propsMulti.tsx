import retry from '@skidding/async-retry';
import React from 'react';
import {
  createValues,
  updatePropsFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
import { HelloMessage } from '../testHelpers/components.js';
import { anyProps, getProps } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: (
    <>
      <HelloMessage name="Blanca" />
      <HelloMessage name="B" />
    </>
  ),
});
const fixtureId = { path: 'first' };

testRenderer(
  'captures multiple props instances',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {},
    });
    await retry(() =>
      expect(renderer.toJSON()).toEqual(['Hello Blanca', 'Hello B'])
    );
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            componentName: 'HelloMessage',
            elPath: 'props.children[0]',
            values: createValues({ name: 'Blanca' }),
          }),
          anyProps({
            componentName: 'HelloMessage',
            elPath: 'props.children[1]',
            values: createValues({ name: 'B' }),
          }),
        ],
      },
    });
  }
);

testRenderer(
  'overwrites prop in second instance',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {},
    });
    const fixtureState = await getLastFixtureState();
    const propsFs = getProps(fixtureState, 2);
    const [, { elementId }] = propsFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updatePropsFixtureStateItem({
          propsFs,
          elementId,
          values: createValues({ name: 'Benjamin' }),
        }),
      },
    });
    await retry(() =>
      expect(renderer.toJSON()).toEqual(['Hello Blanca', 'Hello Benjamin'])
    );
  }
);
