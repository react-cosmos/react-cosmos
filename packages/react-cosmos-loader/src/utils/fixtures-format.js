// @flow

import { importModule } from 'react-cosmos-shared';

import type { Component, Modules } from 'react-cosmos-flow/module';

export function getOldSchoolFixturesFromNewStyleComponents(
  newStyleComponents: Array<Component>
) {
  const fixtures = {};

  newStyleComponents.forEach(c => {
    const componentName = getObjectPath(c);
    fixtures[componentName] = {};

    c.fixtures.forEach(f => {
      const fixtureName = getObjectPath(f);
      fixtures[componentName][fixtureName] = f.source;
    });
  });

  return fixtures;
}

export function normalizeFixtureModules(fixtureModules: Modules) {
  return Object.keys(fixtureModules).reduce((all, next) => {
    return {
      ...all,
      [next]: importModule(fixtureModules[next])
    };
  }, {});
}

function getObjectPath(obj) {
  return obj.namespace ? `${obj.namespace}/${obj.name}` : obj.name;
}
