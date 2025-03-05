import React from 'react';
import { ArraySlot } from 'react-plugin';

export type NavPanelRowSlotProps = {
  onCloseNavPanel: () => unknown;
};

type Props = {
  slotProps: NavPanelRowSlotProps;
  plugOrder: string[];
};

export function NavPanelRowSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot name="navPanelRow" slotProps={slotProps} plugOrder={plugOrder} />
  );
}
