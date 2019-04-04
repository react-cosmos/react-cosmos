import React from 'react';

export function Hello({ greeting, name }) {
  return (
    <h1>
      {greeting || 'Hello'} {name || 'Guest'}!
    </h1>
  );
}
