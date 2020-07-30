import React from 'react';

type Props = {
  name: string;
  label: string;
};

export function Input({ name, label }: Props) {
  return (
    <span>
      (name: {name}, label: {label})
    </span>
  );
}
