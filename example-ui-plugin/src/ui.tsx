import React from 'react';
// @ts-ignore FIXME
import { ValueInputSlotProps } from 'react-cosmos-playground2/dist/shared/slots/ValueInputSlot';
import { createPlugin } from 'react-plugin';

export type BooleanInputPluginSpec = {
  name: 'booleanInputPlugin';
};

const { plug, register } = createPlugin<BooleanInputPluginSpec>({
  name: 'booleanInputPlugin',
});

plug<ValueInputSlotProps>('valueInput', ({ slotProps, children }) => {
  const { item, itemName, parents, onInputChange } = slotProps;
  if (item.type !== 'primitive' || typeof item.value !== 'boolean')
    return <>{children}</>;

  return (
    <button
      onClick={() => onInputChange(!item.value)}
      style={{ marginLeft: parents.length * 12 + 20 }}
    >
      {itemName} {item.value ? 'true' : 'false'}
    </button>
  );
});

register();
