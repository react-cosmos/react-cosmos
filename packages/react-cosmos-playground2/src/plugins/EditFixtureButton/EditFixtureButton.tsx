import React from 'react';
import { EditIcon } from '../../shared/icons';
import { IconButton32 } from '../../shared/ui/buttons';

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
