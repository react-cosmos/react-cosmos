import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { IconButton } from '../../shared/ui';
import { EditIcon } from '../../shared/icons';

type Props = {
  devServerOn: boolean;
  selectedFixtureId: FixtureId | null;
};

export function EditFixtureButton({ devServerOn, selectedFixtureId }: Props) {
  if (!devServerOn || !selectedFixtureId) {
    return null;
  }

  return (
    <IconButton
      icon={<EditIcon />}
      title="Open fixture source"
      onClick={() => openFile(selectedFixtureId.path)}
    />
  );
}

function openFile(filePath: string) {
  fetch(`/_open?filePath=${filePath}`, { credentials: 'same-origin' });
}
