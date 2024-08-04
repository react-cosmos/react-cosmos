import React from 'react';
import { EditIcon, IconButton32 } from 'react-cosmos-ui';

type Props = {
  onClick: () => unknown;
};

export function OpenFixtureButton({ onClick }: Props) {
  return (
    <IconButton32
      icon={<EditIcon />}
      title="Open fixture source (S)"
      onClick={onClick}
    />
  );
}
