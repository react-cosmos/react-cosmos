import React from 'react';
import { Viewport } from 'react-cosmos/client';
import { Hello } from './WelcomeMessage.js';

export default (
  <Viewport width={320} height={568}>
    <Hello greeting="Hi" name="Maggie" />
  </Viewport>
);
