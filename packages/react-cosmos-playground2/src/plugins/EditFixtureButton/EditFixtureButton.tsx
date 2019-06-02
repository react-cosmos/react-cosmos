import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { Button } from '../../shared/ui';
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
    <Button
      icon={<EditIcon />}
      label="edit"
      onClick={() => openFile(selectedFixtureId.path)}
    />
  );
}

function openFile(filePath: string) {
  fetch(`/_open?filePath=${filePath}`, { credentials: 'same-origin' });
}
