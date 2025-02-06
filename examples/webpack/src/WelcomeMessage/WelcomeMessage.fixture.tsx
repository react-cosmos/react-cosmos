import React from 'react';
import { Viewport } from 'react-cosmos/client';
import { WelcomeMessage } from './WelcomeMessage.js';

export default (
  <Viewport width={375} height={667}>
    <WelcomeMessage greeting="Hi" name="Maggie" />
  </Viewport>
);
