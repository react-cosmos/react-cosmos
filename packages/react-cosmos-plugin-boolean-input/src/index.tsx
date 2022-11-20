import React from 'react';
import { ValueInputSlotProps } from 'react-cosmos-ui';
import { createPlugin } from 'react-plugin';
import { BooleanInput } from './BooleanInput';

type BooleanInputPluginSpec = {
  name: 'booleanInputPlugin';
};

const { plug, register } = createPlugin<BooleanInputPluginSpec>({
  name: 'booleanInputPlugin',
});

plug<ValueInputSlotProps>('valueInput', ({ slotProps, children }) => {
  const { name, value, indentLevel, onChange } = slotProps;

  if (value.type === 'primitive' && typeof value.data === 'boolean')
    return (
      <BooleanInput
        name={name}
        checked={value.data}
        indentLevel={indentLevel}
        onChange={onChange}
      />
    );

  // Fall back to default inputs
  return <>{children}</>;
});

register();
