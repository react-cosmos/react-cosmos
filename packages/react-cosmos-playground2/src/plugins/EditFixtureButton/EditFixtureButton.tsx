import * as React from 'react';
import { Button } from '../../shared/components';
import { CastIcon } from '../../shared/icons';

export type EditFixtureButtonProps = {
  devServerOn: boolean;
  // TODO: Selected fixture path
};

export function EditFixtureButton({ devServerOn }: EditFixtureButtonProps) {
  if (!devServerOn) {
    return null;
  }

  return (
    <Button
      icon={<CastIcon />}
      label="edit"
      onClick={() =>
        console.log('TODO Call server endpoint with selected fixture path')
      }
    />
  );
}
