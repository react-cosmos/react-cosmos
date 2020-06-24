import React from 'react';
import { FixtureStateSelect } from 'react-cosmos-shared2/fixtureState';
import { lightBlue } from '../../shared/colors';
import { Select } from '../../shared/inputs/Select';
import { ItemContainer } from '../../shared/valueInputTree/ValueInputTreeItem';
import {
  Label,
  ValueContainer,
} from '../../shared/valueInputTree/ValueInputTreeItem/shared';

type Props = {
  selectName: string;
  fsSelect: FixtureStateSelect;
  onSelectChange: (selectName: string, fsSelect: FixtureStateSelect) => unknown;
};

export function SelectItem({ selectName, fsSelect, onSelectChange }: Props) {
  const { options, currentValue } = fsSelect;
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
              ...fsSelect,
              currentValue: newValue.value,
            })
          }
        />
      </ValueContainer>
    </ItemContainer>
  );
}
