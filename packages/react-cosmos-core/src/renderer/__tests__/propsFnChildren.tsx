import retry from '@skidding/async-retry';
import React from 'react';
import { createValues } from '../../fixtureState/createValues.js';
import { uuid } from '../../utils/uuid.js';
import { FixtureCapture } from '../FixtureCapture/index.js';
import { HelloMessage } from '../testHelpers/components.js';
import { anyProps } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

function Wrap({ children }: { children: () => React.ReactNode }) {
  return <>{children()}</>;
}
Wrap.cosmosCapture = false;

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: (
    <>
      <Wrap>{() => <HelloMessage name="Bianca" />}</Wrap>
      <Wrap>
        {() => (
          <FixtureCapture decoratorId="mockDecoratorId">
            <HelloMessage name="B" />
          </FixtureCapture>
        )}
      </Wrap>
    </>
  ),
});
const fixtureId = { path: 'first' };

testRenderer(
  'captures props from render callback',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await retry(() =>
      expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B'])
    );
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            decoratorId: 'mockDecoratorId',
            values: createValues({ name: 'B' }),
          }),
        ],
      },
    });
  }
);
