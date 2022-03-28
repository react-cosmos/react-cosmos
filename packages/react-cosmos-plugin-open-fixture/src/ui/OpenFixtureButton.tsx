import React from 'react';
import { EditIcon, IconButton32 } from 'react-cosmos-shared2/ui';

type Props = {
  onClick: () => unknown;
};

export function OpenFixtureButton({ onClick }: Props) {
  return (
    <IconButton32
      icon={<EditIcon />}
      title="Open fixture source"
      onClick={onClick}
    />
  );
}
