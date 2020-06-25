import React from 'react';
import { useSelect } from 'react-cosmos/fixture';

const options = {
  one: 'Option 1',
  two: 'Option 2',
  three: 'Option 3',
};

export default () => {
  const [value, setValue] = useSelect('mySelect', {
    defaultValue: 'one',
    options,
  });

  function renderButton(option: keyof typeof options) {
    return (
      <button disabled={value === option} onClick={() => setValue(option)}>
        {options[option]}
      </button>
    );
  }

  return (
    <div>
      {renderButton('one')}
      {renderButton('two')}
      {renderButton('three')}
    </div>
  );
};
