// @flow

import React from 'react';

const HelloWorld = ({ name }: { name: string }) => (
  <h1>Hello {name || 'Guest'}!</h1>
);

export default <HelloWorld name="Maggie" />;
