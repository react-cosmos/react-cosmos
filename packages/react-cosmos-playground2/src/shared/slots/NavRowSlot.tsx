import React from 'react';
import { ArraySlot } from 'react-plugin';

export type NavRowSlotProps = {
  onCloseNav: () => unknown;
};

type Props = {
  slotProps: NavRowSlotProps;
  plugOrder: string[];
};

export function NavRowSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot name="navRow" slotProps={slotProps} plugOrder={plugOrder} />
  );
}
