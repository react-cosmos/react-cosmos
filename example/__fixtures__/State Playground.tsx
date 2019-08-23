import React from 'react';
import { useState } from 'react-cosmos/fixture';

export default () => {
  const [string] = useState('string', { defaultValue: 'How are you doing?' });
  const [number] = useState('number', { defaultValue: 1989 });
  const [boolean] = useState('boolean', { defaultValue: true });

  return <MyComponent string={string} number={number} boolean={boolean} />;
};

function MyComponent(props: Record<string, any>) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
