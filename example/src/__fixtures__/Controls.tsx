import React from 'react';
import { useSelect, useValue } from 'react-cosmos/fixture';

export default () => {
  const [string] = useValue('string', { defaultValue: 'How are you doing?' });
  const [number] = useValue('number', { defaultValue: 1989 });
  const [boolean] = useValue('boolean', { defaultValue: true });
  const [object] = useValue('object', {
    defaultValue: { isAdmin: true, name: 'Pat D', age: 44 },
  });
  const [value, setValue] = useSelect('mySelect', {
    options: ['Option 1', 'Option 2', 'Option 3'],
  });
  const [array] = useValue('array', {
    defaultValue: [
      { isAdmin: true, name: 'Pat D', age: 44 },
      { isAdmin: false, name: 'Dan B', age: 39 },
    ],
  });

  function renderButton(option: typeof value) {
    return (
      <button disabled={value === option} onClick={() => setValue(option)}>
        {option}
      </button>
    );
  }

  return (
    <>
      <MyComponent
        string={string}
        number={number}
        boolean={boolean}
        object={object}
        array={array}
      />
      <div>
        {renderButton('Option 1')}
        {renderButton('Option 2')}
        {renderButton('Option 3')}
      </div>
    </>
  );
};

function MyComponent(props: Record<string, any>) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
