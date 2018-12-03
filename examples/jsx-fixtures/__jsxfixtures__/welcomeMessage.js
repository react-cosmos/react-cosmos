// @flow

import React from 'react';
import { Viewport } from '../decorators/Viewport';

const Hello = ({ greeting, name }: { greeting?: string, name?: string }) => (
  <h1>
    {greeting || 'Hello'} {name || 'Guest'}!
  </h1>
);

export default (
  <Viewport width={320} height={568}>
    <Hello greeting="Hi" name="Maggie" />
  </Viewport>
);
