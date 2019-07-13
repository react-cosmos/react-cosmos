import React from 'react';
import { BlankState } from './BlankState';
import { Viewport } from 'react-cosmos-fixture';

export default (
  <Viewport width={320} height={480}>
    <BlankState fixturesDir="__fixtures__" fixtureFileSuffix="fixture" />
  </Viewport>
);
