import React from 'react';
import { IconButton32 } from 'react-cosmos-playground2/src/shared/buttons';
import { EditIcon } from 'react-cosmos-playground2/src/shared/icons';

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
