import React, { ReactNode } from 'react';
import { PrimitiveData } from 'react-cosmos-shared2/fixtureState';
import { Slot } from 'react-plugin';
import { LeafValue } from '../valueInputTree/shared';

export type ValueInputSlotProps = {
  id: string;
  name: string;
  value: LeafValue;
  indentLevel: number;
  onChange: (data: PrimitiveData) => unknown;
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
