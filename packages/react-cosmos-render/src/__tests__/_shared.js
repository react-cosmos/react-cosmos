// @flow

import React from 'react';
import { create as fakeRender } from 'react-test-renderer';
import { getNodeFromFixture } from '../shared';
import { CosmosRenderer } from '../CosmosRenderer';

import type { Fixture } from '../types';

export function render(fixture: Fixture) {
  return fakeRender(
    <CosmosRenderer>{getNodeFromFixture(fixture)}</CosmosRenderer>
  ).toJSON();
}
