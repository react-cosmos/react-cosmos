import { FixtureElementId, FixtureStateValues } from 'react-cosmos-core';
import { stringifyElementId } from './shared.js';

interface FixtureStateValueGroup {
  elementId: FixtureElementId;
  values: FixtureStateValues;
}

export function hasFsValues(valueGroup: FixtureStateValueGroup) {
  return Object.keys(valueGroup.values).length > 0;
}

export function sortFsValueGroups<GroupType extends FixtureStateValueGroup>(
  valueGroups: GroupType[]
): GroupType[] {
  // Sort by elementId
  return valueGroups
    .slice()
    .sort((g1, g2) =>
      stringifyElementId(g1.elementId).localeCompare(
        stringifyElementId(g2.elementId)
      )
    );
}
