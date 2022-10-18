import React from 'react';
import { IconButton32 } from '../../components/buttons';
import { StarIcon } from '../../components/icons';

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
