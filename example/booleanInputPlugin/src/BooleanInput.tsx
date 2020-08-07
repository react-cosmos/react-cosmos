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
    <label
      style={{
        display: 'flex',
        height: 28,
        marginLeft: indentLevel * 12 + 20,
        flexDirection: 'row',
        alignItems: 'center',
        color: 'rgb(224, 224, 224)',
        userSelect: 'none',
        lineHeight: 28,
      }}
    >
      <input
        style={{ marginRight: 8 }}
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />
      {itemName}
    </label>
  );
}
