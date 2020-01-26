import React from 'react';
import { Slot } from 'react-plugin';

export type NavSlotProps = {
  onCloseNav: () => unknown;
};

type Props = {
  slotProps: NavSlotProps;
};

export function NavSlot({ slotProps }: Props) {
  return <Slot name="nav" slotProps={slotProps} />;
}
