import React from 'react';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { FixtureSearchResult } from './FixtureSearchResult';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  onClose: () => unknown;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function FixtureSearchOverlay({
  fixturesDir,
  fixtureFileSuffix,
  fixtures,
  onClose,
  onSelect
}: Props) {
  const fixtureIds = React.useMemo(() => createFixtureIds(fixtures), [
    fixtures
  ]);
  return (
    <Overlay onClick={onClose} data-testid="fixtureSearchOverlay">
      <Content data-testid="fixtureSearchContent">
        <InputContainer />
        <Results>
          {fixtureIds.map((fixtureId, idx) => (
            <FixtureSearchResult
              key={idx}
              fixturesDir={fixturesDir}
              fixtureFileSuffix={fixtureFileSuffix}
              fixtureId={fixtureId}
              onSelect={onSelect}
            />
          ))}
        </Results>
      </Content>
    </Overlay>
  );
}

function createFixtureIds(fixturesByPath: FixtureNamesByPath): FixtureId[] {
  const fixtureIds: FixtureId[] = [];
  Object.keys(fixturesByPath).forEach(fixturePath => {
    const fixtureNames = fixturesByPath[fixturePath];
    if (fixtureNames === null) {
      fixtureIds.push({ path: fixturePath, name: null });
    } else {
      fixtureNames.forEach(fixtureName => {
        fixtureIds.push({ path: fixturePath, name: fixtureName });
      });
    }
  });
  return fixtureIds;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
`;

const Content = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 80%;
  max-width: 512px;
  max-height: 452px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 1px;
  background: hsla(var(--hue-primary), 20%, 24%, 1);
  box-shadow: inset 0px 0px 0px 1px rgba(255, 255, 255, 0.32),
    0px 0px 0px 1px hsla(var(--hue-primary), 21%, 16%, 1),
    0 2px 16px 1px var(--grey1);
  color: var(--grey5);
  overflow: hidden;
`;

const InputContainer = styled.div`
  flex-shrink: 0;
  height: 48px;
`;

const Results = styled.div`
  flex: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: hidden;
  overflow-y: auto;
`;
