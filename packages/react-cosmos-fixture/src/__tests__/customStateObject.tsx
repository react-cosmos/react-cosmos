import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
// Warning: Import test helpers before tested source to mock Socket.IO
import { runFixtureLoaderTests } from '../testHelpers';
import { resetPersistentValues } from '../useState/shared/persistentValueStore';
import { useState } from '..';

type Profile = {
  isAdmin: boolean;
  name: string;
  age: number;
};

function createFixtures({ defaultValue }: { defaultValue: Profile }) {
  const MyComponent = () => {
    const [profile, setProfile] = useState('profile', { defaultValue });
    return (
      <>
        <p>{JSON.stringify(profile, null, 2)}</p>
        <button
          onClick={() => setProfile({ ...profile, isAdmin: !profile.isAdmin })}
        >
          Toggle admin
        </button>
      </>
    );
  };
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures({
  defaultValue: { isAdmin: true, name: 'Pat D', age: 45 }
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
        await rendered(renderer, { isAdmin: true, name: 'Pat D', age: 45 });
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
              profile: {
                defaultValue: {
                  type: 'object',
                  values: {
                    isAdmin: { type: 'primitive', value: true },
                    name: { type: 'primitive', value: 'Pat D' },
                    age: { type: 'primitive', value: 45 }
                  }
                },
                currentValue: {
                  type: 'object',
                  values: {
                    isAdmin: { type: 'primitive', value: true },
                    name: { type: 'primitive', value: 'Pat D' },
                    age: { type: 'primitive', value: 45 }
                  }
                }
              }
            }
          }
        });
      }
    );
  });

  it('updates fixture state via setter', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, { isAdmin: true, name: 'Pat D', age: 45 });
        toggleAdminButton(renderer);
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              profile: {
                defaultValue: {
                  type: 'object',
                  values: {
                    isAdmin: { type: 'primitive', value: true },
                    name: { type: 'primitive', value: 'Pat D' },
                    age: { type: 'primitive', value: 45 }
                  }
                },
                currentValue: {
                  type: 'object',
                  values: {
                    isAdmin: { type: 'primitive', value: false },
                    name: { type: 'primitive', value: 'Pat D' },
                    age: { type: 'primitive', value: 45 }
                  }
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
        await rendered(renderer, { isAdmin: true, name: 'Pat D', age: 45 });
        update({
          rendererId,
          fixtures: createFixtures({
            defaultValue: { isAdmin: false, name: 'Pat D', age: 45 }
          }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              profile: {
                defaultValue: {
                  type: 'object',
                  values: {
                    isAdmin: { type: 'primitive', value: false },
                    name: { type: 'primitive', value: 'Pat D' },
                    age: { type: 'primitive', value: 45 }
                  }
                },
                currentValue: {
                  type: 'object',
                  values: {
                    isAdmin: { type: 'primitive', value: false },
                    name: { type: 'primitive', value: 'Pat D' },
                    age: { type: 'primitive', value: 45 }
                  }
                }
              }
            }
          }
        });
      }
    );
  });
});

async function rendered(renderer: ReactTestRenderer, profile: Profile) {
  await retry(() => Boolean(renderer.toJSON()));
  await retry(() => {
    const profileText = getProfileText(getProfileNode(renderer));
    expect(profileText).toMatch(`"isAdmin": ${profile.isAdmin}`);
    expect(profileText).toMatch(`"name": "${profile.name}"`);
    expect(profileText).toMatch(`"age": ${profile.age}`);
  });
}

function toggleAdminButton(renderer: ReactTestRenderer) {
  getButtonNode(renderer).props.onClick();
}

function getProfileNode(renderer: ReactTestRenderer) {
  return (renderer.toJSON() as any)[0] as ReactTestRendererJSON;
}

function getButtonNode(renderer: ReactTestRenderer) {
  return (renderer.toJSON() as any)[1] as ReactTestRendererJSON;
}

function getProfileText(rendererNode: ReactTestRendererJSON) {
  return rendererNode.children!.join('');
}
