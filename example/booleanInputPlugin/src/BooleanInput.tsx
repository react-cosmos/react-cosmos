import React from 'react';

type Props = {
  indentLevel: number;
  itemName: string;
  value: boolean;
  onChange: (value: boolean) => unknown;
};

export function BooleanInput({
  indentLevel,
  itemName,
  value,
  onChange,
}: Props) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{ marginLeft: indentLevel * 12 + 20 }}
    >
      {itemName} {value ? 'true' : 'false'}
    </button>
  );
}
