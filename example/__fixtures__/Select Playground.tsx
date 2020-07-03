import React from 'react';
import { useSelect } from 'react-cosmos/fixture';

export default () => {
  const [value, setValue] = useSelect('mySelect', {
    options: ['Option 1', 'Option 2', 'Option 3'],
  });

  function renderButton(option: typeof value) {
    return (
      <button disabled={value === option} onClick={() => setValue(option)}>
        {option}
      </button>
    );
  }

  return (
    <div>
      {renderButton('Option 1')}
      {renderButton('Option 2')}
      {renderButton('Option 3')}
    </div>
  );
};
