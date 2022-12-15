import React from 'react';
import { IconButton32 } from '../../components/buttons/index.js';
import { StarIcon } from '../../components/icons/index.js';

type Props = {
  selected: boolean;
  onClick: () => unknown;
};

export function BookmarkFixtureButton({ selected, onClick }: Props) {
  return (
    <IconButton32
      icon={<StarIcon />}
      selected={selected}
      title="Bookmark fixture"
      onClick={onClick}
    />
  );
}
