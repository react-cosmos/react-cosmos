import React from 'react';

export function Hello({ greeting = 'Hello', name = 'Guest' }) {
  return (
    <h1>
      {greeting} <strong>{name}</strong>!
    </h1>
  );
}
