import React from 'react';
import { IconButton32 } from '../../shared/buttons';
import { ExternalIcon } from '../../shared/icons';

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
