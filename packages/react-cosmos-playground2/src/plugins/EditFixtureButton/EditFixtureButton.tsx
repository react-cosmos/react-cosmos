import * as React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { Button } from '../../shared/components';
import { EditIcon } from '../../shared/icons';

export type EditFixtureButtonProps = {
  devServerOn: boolean;
  selectedFixtureId: FixtureId | null;
};

export function EditFixtureButton({
  devServerOn,
  selectedFixtureId
}: EditFixtureButtonProps) {
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
