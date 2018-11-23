// @flow

import React from 'react';

const Hello = ({ greeting, name }: { greeting?: string, name?: string }) => (
  <h1>
    {greeting || 'Hello'} {name || 'Guest'}!
  </h1>
);

export default <Hello greeting="Hi" name="Maggie" />;
