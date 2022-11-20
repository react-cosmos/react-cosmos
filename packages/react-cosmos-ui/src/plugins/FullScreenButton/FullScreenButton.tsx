import React from 'react';
import { IconButton32 } from '../../components/buttons';
import { ExternalIcon } from '../../components/icons';

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
