import React from 'react';

type Props = {
  id: string;
  value: boolean;
  onChange: (newValue: boolean) => unknown;
};

// TODO: Wrap the input in the label (if it stays an input after styling...)
export function BooleanInput({ id, value, onChange }: Props) {
  const onInputChange = React.useCallback(() => onChange(!value), [
    onChange,
    value
  ]);

  return (
    <input type="checkbox" name={id} checked={value} onChange={onInputChange} />
  );
}
