import React from 'react';
import { createPlugin } from 'react-plugin';
const { plug, register } = createPlugin({
  name: 'booleanInputPlugin',
});
plug('valueInput', ({ slotProps, children }) => {
  const { item, itemName, parents, onInputChange } = slotProps;
  if (item.type !== 'primitive' || typeof item.value !== 'boolean')
    return React.createElement(React.Fragment, null, children);
  return React.createElement(
    'button',
    {
      onClick: () => onInputChange(!item.value),
      style: { marginLeft: parents.length * 12 + 20 },
    },
    itemName,
    ' ',
    item.value ? 'true' : 'false'
  );
});
export { register };
