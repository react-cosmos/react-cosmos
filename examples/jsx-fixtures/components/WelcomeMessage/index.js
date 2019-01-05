// @flow

import React from 'react';

type Props = {
  greeting?: string,
  name?: string
};

export function Hello({ greeting, name }: Props) {
  return (
    <h1>
      {greeting || 'Hello'} {name || 'Guest'}!
    </h1>
  );
}
