import React from 'react';
import { Slot } from 'react-plugin';

export default () => {
  // Force plugins to reload on HMR
  return <Slot key={Date.now()} name="root" />;
};
