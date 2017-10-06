/* global localStorage */

import React from 'react';

export default () => {
  const name = localStorage.getItem('name');
  let inputNode;

  if (!name) {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          localStorage.setItem('name', inputNode.value);
        }}
      >
        Who are you?{' '}
        <input
          ref={node => {
            inputNode = node;
          }}
          type="text"
        />
        <input type="submit" />
      </form>
    );
  }

  return (
    <span>
      Hi <strong>{name}</strong>!
    </span>
  );
};
