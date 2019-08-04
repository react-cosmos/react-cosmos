import React from 'react';
import { useFocus } from './shared';

type BaseOption = { value: string; label: string };

type Props<Option extends BaseOption> = {
  id?: string;
  testId?: string;
  options: Option[];
  value: string;
  onChange: (newValue: Option) => unknown;
};

export function Select<Option extends BaseOption>({
  id,
  testId,
  options,
  value,
  onChange
}: Props<Option>) {
  const { onFocus, onBlur } = useFocus();

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const option = options.find(o => o.value === e.target.value);
      if (!option) {
        throw new Error(`Select value doesn't match any option`);
      }
      onChange(option);
    },
    [onChange, options]
  );

  return (
    <select
      id={id}
      data-testid={testId}
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onInputChange}
    >
      {options.map((option, idx) => {
        const isSelected = value === option.value;
        return (
          <option key={idx} value={option.value} disabled={isSelected}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
}
