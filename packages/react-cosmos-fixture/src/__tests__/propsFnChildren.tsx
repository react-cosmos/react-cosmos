import * as React from 'react';
import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import { HelloMessage } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';
import { FixtureCapture } from '..';

function Wrap({ children }: { children: () => React.ReactNode }) {
  return <>{children()}</>;
}
Wrap.cosmosCapture = false;

const rendererId = uuid();
const fixtures = {
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
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('captures props from render callback', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        await retry(() =>
          expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B'])
        );
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                decoratorId: 'mockDecoratorId',
                props: createFxValues({ name: 'B' })
              })
            ]
          }
        });
      }
    );
  });
});
