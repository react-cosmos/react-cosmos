import React from 'react';
import { ValueInputSlotProps } from 'react-cosmos-playground2/plugin';
import { createPlugin } from 'react-plugin';
import { BooleanInput } from './BooleanInput';

type BooleanInputPluginSpec = {
  name: 'booleanInputPlugin';
};

const { plug, register } = createPlugin<BooleanInputPluginSpec>({
  name: 'booleanInputPlugin',
});

plug<ValueInputSlotProps>('valueInput', ({ slotProps, children }) => {
  const { item, itemName, parents, onInputChange } = slotProps;

  if (item.type === 'primitive' && typeof item.value === 'boolean')
    return (
      <BooleanInput
        indentLevel={parents.length}
        itemName={itemName}
        value={item.value}
        onChange={onInputChange}
      />
    );

  return <>{children}</>;
});

register();
