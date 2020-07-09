import React from 'react';
import { FixtureStateSelectControl } from 'react-cosmos-shared2/fixtureState';
import { lightBlue } from '../../shared/colors';
import { Select } from '../../shared/inputs/Select';
import { ItemContainer } from '../../shared/valueInputTree/ValueInputTreeItem';
import {
  Label,
  ValueContainer,
} from '../../shared/valueInputTree/ValueInputTreeItem/shared';

type Props = {
  selectName: string;
  select: FixtureStateSelectControl;
  onSelectChange: (
    selectName: string,
    select: FixtureStateSelectControl
  ) => unknown;
};

export function SelectItem({ selectName, select, onSelectChange }: Props) {
  const { options, currentValue } = select;
  const id = `select-${selectName}`;
  return (
    <ItemContainer key={selectName}>
      <Label title={selectName} htmlFor={id}>
        {selectName}
      </Label>
      <ValueContainer>
        <Select
          id={id}
          options={options.map(option => ({
            value: option,
            label: option,
          }))}
          value={currentValue}
          color={lightBlue}
          height={24}
          padding={5}
          onChange={newValue =>
            onSelectChange(selectName, {
              ...select,
              currentValue: newValue.value,
            })
          }
        />
      </ValueContainer>
    </ItemContainer>
  );
}
