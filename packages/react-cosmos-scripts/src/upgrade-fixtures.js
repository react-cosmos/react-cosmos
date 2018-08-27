// @flow

import { readFileSync, writeFileSync } from 'fs';
import { dirname, relative } from 'path';
import camelCase from 'lodash.camelcase';
import upperFirst from 'lodash.upperfirst';
import { slash } from 'react-cosmos-shared/server';
import { getCosmosConfig } from 'react-cosmos-config';
import getFilePaths from 'react-cosmos-voyager';
import { addComponentToFixture } from './transforms/add-component-to-fixture';

import type { Config } from 'react-cosmos-flow/config';

const { keys } = Object;

export default function upgradeFixtures() {
  const config: Config = getCosmosConfig();

  if (config.componentPaths.length === 0) {
    console.warn('[Cosmos] Could not find `componentPaths` in config. Abort.');
  }

  const { components, fixtures } = getFilePaths(config);

  keys(fixtures).forEach(componentName => {
    keys(fixtures[componentName]).forEach(fixtureName => {
      const fixturePath = fixtures[componentName][fixtureName];
      const componentPathAbs = components[componentName];
      const componentPath = slash(
        relative(dirname(fixturePath), componentPathAbs)
      );

      const fixtureCode = readFileSync(fixturePath, 'utf8');
      const newFixtureCode = addComponentToFixture({
        fixtureCode,
        componentPath,
        componentName: getIdentifiableComponentName(componentName)
      });
      writeFileSync(fixturePath, newFixtureCode, 'utf8');
    });
  });
}

function getIdentifiableComponentName(name) {
  return upperFirst(camelCase(name.split('/').pop()));
}
