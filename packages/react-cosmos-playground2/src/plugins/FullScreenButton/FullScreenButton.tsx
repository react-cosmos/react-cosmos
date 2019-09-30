import React from 'react';
import { ExternalIcon } from '../../shared/icons';
import { IconButton32 } from '../../shared/ui/buttons';

type Props = {
  onClick: () => void;
};

export function FullScreenButton({ onClick }: Props) {
  return (
    <IconButton32
      icon={<ExternalIcon />}
      title="Go fullscreen"
      onClick={onClick}
    />
  );
}
