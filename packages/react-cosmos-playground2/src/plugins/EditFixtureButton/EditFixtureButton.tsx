import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { IconButton } from '../../shared/ui';
import { EditIcon } from '../../shared/icons';

type Props = {
  devServerOn: boolean;
  selectedFixtureId: FixtureId | null;
  onError: (info: string) => unknown;
};

export function EditFixtureButton({
  devServerOn,
  selectedFixtureId,
  onError
}: Props) {
  if (!devServerOn || !selectedFixtureId) {
    return null;
  }

  const handleClick = async () => {
    const httpStatus = await openFile(selectedFixtureId.path);
    switch (httpStatus) {
      case 200:
        // No need to notify when everything is OK
        return;
      case 400:
        return onError('This looks like a bug. Let us know please!');
      case 404:
        return onError('File is missing. Weird!');
      default:
        return onError(
          'Does your OS know to open source files with your code editor?'
        );
    }
  };

  return (
    <IconButton
      icon={<EditIcon />}
      title="Open fixture source"
      onClick={handleClick}
    />
  );
}

async function openFile(filePath: string) {
  const url = `/_open?filePath=${filePath}`;
  const { status } = await fetch(url, { credentials: 'same-origin' });
  return status;
}
