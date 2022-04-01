import React from 'react';
import { IconButton32 } from '../../ui/components/buttons';
import { StarIcon } from '../../ui/components/icons';

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
