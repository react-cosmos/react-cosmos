import React from 'react';
import { MaximizeIcon } from '../../shared/icons';
import { IconButton32 } from '../../shared/ui/buttons';

type Props = {
  onClick: () => void;
};

export function FullScreenButton({ onClick }: Props) {
  return (
    <IconButton32
      icon={<MaximizeIcon />}
      title="Go fullscreen"
      onClick={onClick}
    />
  );
}
