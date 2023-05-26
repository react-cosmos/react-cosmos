import React from 'react';
import { Viewport } from 'react-cosmos/client';
import { Hello } from './WelcomeMessage.js';

export default (
  <Viewport width={375} height={667}>
    <Hello greeting="Hi" name="Maggie" />
  </Viewport>
);
