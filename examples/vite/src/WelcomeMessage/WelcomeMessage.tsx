import React from 'react';

export function WelcomeMessage({ greeting = 'Hello', name = 'Guest' }) {
  return (
    <h1>
      {greeting} <strong>{name}</strong>!
    </h1>
  );
}
