import React from 'react';
import { useState } from 'react-cosmos/fixture';

export default () => {
  const [string] = useState('string', { defaultValue: 'How are you doing?' });
  const [number] = useState('number', { defaultValue: 1989 });
  const [boolean] = useState('boolean', { defaultValue: true });
  const [object] = useState('object', {
    defaultValue: { isAdmin: true, name: 'Pat D', age: 44 }
  });
  const [array] = useState('array', {
    defaultValue: [
      { isAdmin: true, name: 'Pat D', age: 44 },
      { isAdmin: false, name: 'Dan B', age: 39 }
    ]
  });

  return (
    <MyComponent
      string={string}
      number={number}
      boolean={boolean}
      object={object}
      array={array}
    />
  );
};

function MyComponent(props: Record<string, any>) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
