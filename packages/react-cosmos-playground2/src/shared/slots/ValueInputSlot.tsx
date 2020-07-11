import React, { ReactNode } from 'react';
import { FixtureStatePrimitiveValueType } from 'react-cosmos-shared2/fixtureState';
import { Slot } from 'react-plugin';
import { TreeItemValue } from '../valueInputTree/shared';

type ValueInputSlotProps = {
  item: TreeItemValue;
  itemId: string;
  itemName: string;
  onInputChange: (value: FixtureStatePrimitiveValueType) => unknown;
};

type Props = {
  children: ReactNode;
  slotProps: ValueInputSlotProps;
};

export function ValueInputSlot({ children, slotProps }: Props) {
  return (
    <Slot name="valueInput" slotProps={slotProps}>
      {children}
    </Slot>
  );
}
