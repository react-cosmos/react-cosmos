import React from 'react';
import { Viewport } from 'react-cosmos-core/fixture';
import { Hello } from './WelcomeMessage';

export default (
  <Viewport width={320} height={568}>
    <Hello greeting="Hi" name="Maggie" />
  </Viewport>
);
