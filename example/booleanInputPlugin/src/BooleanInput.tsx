import React from 'react';

type Props = {
  name: string;
  checked: boolean;
  indentLevel: number;
  onChange: (value: boolean) => unknown;
};

export function BooleanInput({ indentLevel, name, checked, onChange }: Props) {
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
        lineHeight: '28px',
      }}
    >
      <input
        style={{ marginRight: 8 }}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      {name}
    </label>
  );
}
