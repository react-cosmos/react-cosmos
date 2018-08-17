// @flow

import React from 'react';
import { create as fakeRender } from 'react-test-renderer';
import { CosmosRenderer } from '../CosmosRenderer';

import type { Fixture } from '../types';

export function render(fixture: Fixture) {
  return fakeRender(<CosmosRenderer>{fixture}</CosmosRenderer>).toJSON();
}
