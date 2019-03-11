import * as React from 'react';
import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';

type Props = {
  children: React.ReactNode;
};

const rendererId = uuid();
const fixtures = {
  'src/foo/__fixtures__/default.js': 'Hello!'
};
const decorators = {
  'src/decorator.js': ({ children }: Props) => <>Decorated at src{children}</>,
  'src/foo/decorator.js': ({ children }: Props) => (
    <>Decorated at src/foo{children}</>
  ),
  'src/bar/decorator.js': ({ children }: Props) => (
    <>Decorated at src/bar{children}</>
  )
};

runTests(mockConnect => {
  it('renders selected fixture inside decorator', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          const [path] = Object.keys(fixtures);
          await selectFixture({
            rendererId,
            fixtureId: { path, name: null },
            fixtureState: null
          });

          // "src/bar/decorator" should be omitted because it's not a placed in
          // a parent directory of the selected fixture
          await retry(() =>
            expect(renderer.toJSON()).toEqual([
              'Decorated at src',
              'Decorated at src/foo',
              'Hello!'
            ])
          );
        }
      );
    });
  });
});
