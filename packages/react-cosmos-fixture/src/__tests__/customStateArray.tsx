import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
// Warning: Import test helpers before tested source to mock Socket.IO
import { runFixtureLoaderTests } from '../testHelpers';
import { resetPersistentValues } from '../useState/shared/persistentValueStore';
import { useState } from '..';
import { ReactTestRenderer } from 'react-test-renderer';
import retry from '@skidding/async-retry';

type Profile = {
  isAdmin: boolean;
  name: string;
  age: number;
  onClick: () => unknown;
};

function createFixtures({ defaultValue }: { defaultValue: Profile[] }) {
  const MyComponent = () => {
    const [profiles] = useState('profiles', { defaultValue });
    return <>{JSON.stringify(profiles, null, 2)}</>;
  };
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures({
  defaultValue: [{ isAdmin: true, name: 'Pat D', age: 45, onClick: () => {} }]
});
const decorators = {};
const fixtureId = { path: 'first', name: null };

afterEach(resetPersistentValues);

runFixtureLoaderTests(mount => {
  it('renders fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, [{ isAdmin: true, name: 'Pat D', age: 45 }]);
      }
    );
  });

  it('creates fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              profiles: {
                defaultValue: {
                  type: 'array',
                  values: [
                    {
                      type: 'object',
                      values: {
                        isAdmin: { type: 'primitive', value: true },
                        name: { type: 'primitive', value: 'Pat D' },
                        age: { type: 'primitive', value: 45 },
                        onClick: {
                          type: 'unserializable',
                          stringifiedValue: '() => {}'
                        }
                      }
                    }
                  ]
                },
                currentValue: {
                  type: 'array',
                  values: [
                    {
                      type: 'object',
                      values: {
                        isAdmin: { type: 'primitive', value: true },
                        name: { type: 'primitive', value: 'Pat D' },
                        age: { type: 'primitive', value: 45 },
                        onClick: {
                          type: 'unserializable',
                          stringifiedValue: '() => {}'
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        });
      }
    );
  });

  it('resets fixture state on default value change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        update({
          rendererId,
          fixtures: createFixtures({
            defaultValue: [
              { isAdmin: false, name: 'Pat D', age: 45, onClick: () => {} },
              { isAdmin: true, name: 'Dan B', age: 39, onClick: () => {} }
            ]
          }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              profiles: {
                defaultValue: {
                  type: 'array',
                  values: [
                    {
                      type: 'object',
                      values: {
                        isAdmin: { type: 'primitive', value: false },
                        name: { type: 'primitive', value: 'Pat D' },
                        age: { type: 'primitive', value: 45 },
                        onClick: {
                          type: 'unserializable',
                          stringifiedValue: '() => {}'
                        }
                      }
                    },
                    {
                      type: 'object',
                      values: {
                        isAdmin: { type: 'primitive', value: true },
                        name: { type: 'primitive', value: 'Dan B' },
                        age: { type: 'primitive', value: 39 },
                        onClick: {
                          type: 'unserializable',
                          stringifiedValue: '() => {}'
                        }
                      }
                    }
                  ]
                },
                currentValue: {
                  type: 'array',
                  values: [
                    {
                      type: 'object',
                      values: {
                        isAdmin: { type: 'primitive', value: false },
                        name: { type: 'primitive', value: 'Pat D' },
                        age: { type: 'primitive', value: 45 },
                        onClick: {
                          type: 'unserializable',
                          stringifiedValue: '() => {}'
                        }
                      }
                    },
                    {
                      type: 'object',
                      values: {
                        isAdmin: { type: 'primitive', value: true },
                        name: { type: 'primitive', value: 'Dan B' },
                        age: { type: 'primitive', value: 39 },
                        onClick: {
                          type: 'unserializable',
                          stringifiedValue: '() => {}'
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        });
      }
    );
  });
});

async function rendered(
  renderer: ReactTestRenderer,
  profiles: Array<Pick<Profile, 'isAdmin' | 'name' | 'age'>>
) {
  await retry(() => {
    const renderedText = getRenderedText(renderer);
    profiles.forEach(profile => {
      expect(renderedText).toMatch(`"isAdmin": ${profile.isAdmin}`);
      expect(renderedText).toMatch(`"name": "${profile.name}"`);
      expect(renderedText).toMatch(`"age": ${profile.age}`);
    });
  });
}

function getRenderedText(renderer: ReactTestRenderer) {
  return renderer.toJSON();
}
