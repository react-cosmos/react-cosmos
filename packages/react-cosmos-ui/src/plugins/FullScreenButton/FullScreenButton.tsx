import React from 'react';
import { IconButton32 } from '../../components/buttons/index.js';
import { ExternalIcon } from '../../components/icons/index.js';

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
