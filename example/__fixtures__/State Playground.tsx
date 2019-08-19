import React from 'react';
import { useBoolean, useNumber, useString } from 'react-cosmos/fixture';

export default () => {
  const [string] = useString('string', { defaultValue: 'How are you doing?' });
  const [number] = useNumber('number', { defaultValue: 1989 });
  const [boolean] = useBoolean('boolean', { defaultValue: true });

  return <MyComponent string={string} number={number} boolean={boolean} />;
};

function MyComponent(props: Record<string, any>) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
