import React from 'react';

type Props = {
  id: string;
  value: number;
  onChange: (newValue: number) => unknown;
};

export function NumberInput({ id, value, onChange }: Props) {
  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const newValue = +e.currentTarget.value;
      if (!isNaN(newValue)) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  return <input type="text" id={id} value={value} onChange={onInputChange} />;
}
