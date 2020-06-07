import React from 'react';
import { IconButton32 } from '../../shared/buttons';
import { EditIcon } from '../../shared/icons';

type Props = {
  onClick: () => unknown;
};

export function EditFixtureButton({ onClick }: Props) {
  return (
    <IconButton32
      icon={<EditIcon />}
      title="Open fixture source"
      onClick={onClick}
    />
  );
}
