import React from 'react';
import { Viewport } from 'react-cosmos/fixture';
import { Hello } from '.';

export default {
  'full screen': <Hello greeting="Hi" name="Maggie" />,

  'small screen': (
    <Viewport width={320} height={568}>
      <Hello greeting="Hi" name="Maggie" />
    </Viewport>
  )
};
