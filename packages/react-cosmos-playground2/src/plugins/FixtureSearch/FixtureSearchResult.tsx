import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  removeFixtureNameExtension,
  removeFixtureNameSuffix
} from '../../shared/fixture';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtureId: FixtureId;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function FixtureSearchResult({
  fixturesDir,
  fixtureFileSuffix,
  fixtureId,
  onSelect
}: Props) {
  const { path, name } = fixtureId;
  const { dirs, fileName } = parseFixturePath(
    path,
    fixturesDir,
    fixtureFileSuffix
  );
  return (
    <Container onClick={() => onSelect(fixtureId)}>
      {[...dirs, fileName].join('/')}
      {name !== null && ` ${name}`}
    </Container>
  );
}

function parseFixturePath(
  fixturePath: string,
  fixturesDir: string,
  fixtureFileSuffix: string
) {
  const pathParts = fixturePath.split('/');
  const fileName = getCleanFileName(pathParts.pop()!, fixtureFileSuffix);
  const dirs = pathParts.filter(dir => dir !== fixturesDir);
  return { dirs, fileName };
}

function getCleanFileName(fileName: string, fixtureFileSuffix: string) {
  return removeFixtureNameSuffix(
    removeFixtureNameExtension(fileName),
    fixtureFileSuffix
  );
}

const Container = styled.div`
  padding: 0 16px;
  line-height: 32px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  user-select: none;
`;
