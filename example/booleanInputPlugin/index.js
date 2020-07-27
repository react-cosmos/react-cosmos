// TODO: Generate this via webpack (handle shared global React & ReactPlugin)
const { plug, register } = ReactPlugin.createPlugin({
  name: 'booleanInputPlugin',
});

plug('valueInput', ({ slotProps, children }) => {
  const { item, itemName, parents, onInputChange } = slotProps;
  if (item.type !== 'primitive' || typeof item.value !== 'boolean')
    return children;

  return React.createElement(
    'button',
    {
      onClick: () => onInputChange(!item.value),
      style: { marginLeft: parents.length * 12 + 20 },
    },
    `${itemName} ${item.value ? 'true' : 'false'}`
  );
});

register();
