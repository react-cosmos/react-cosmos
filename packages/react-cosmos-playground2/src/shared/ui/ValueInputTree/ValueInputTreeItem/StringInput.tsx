import React from 'react';

type Props = {
  id: string;
  value: string;
  onChange: (newValue: string) => unknown;
};

export function StringInput({ id, value, onChange }: Props) {
  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) =>
      onChange(e.currentTarget.value),
    [onChange]
  );

  return <input type="text" id={id} value={value} onChange={onInputChange} />;
}
