import React from 'react';
import { useValue } from 'react-cosmos/fixture';

export default () => {
  const [string] = useValue('string', { defaultValue: 'How are you doing?' });
  const [number] = useValue('number', { defaultValue: 1989 });
  const [boolean] = useValue('boolean', { defaultValue: true });
  const [object] = useValue('object', {
    defaultValue: { isAdmin: true, name: 'Pat D', age: 44 },
  });
  const [array] = useValue('array', {
    defaultValue: [
      { isAdmin: true, name: 'Pat D', age: 44 },
      { isAdmin: false, name: 'Dan B', age: 39 },
    ],
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
