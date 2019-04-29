import styled from 'styled-components';
import React from 'react';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { StorageSpec } from '../Storage/public';
import { FixtureTree } from './FixtureTree';
import { useDrag } from '../../shared/ui';

type Props = {
  projectId: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  fullScreen: boolean;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  storage: StorageSpec['methods'];
};

const DEFAULT_WIDTH = 256;
const MIN_WIDTH = 64;
const MAX_WIDTH = 512;

// TODO: Show overlay over renderer preview while dragging
// IDEA: Split into two components (NavContainer and Nav)
// TODO: Make Storage sync by using a local mirror that is only loaded async
// once when the Core plugin loads. Also keep all settings for a project
// together, and not have to concat projectId with each key. Ideally, this
// component would receive "lastNavWidth: number" and "setLastNavWidth"
export function Nav({
  projectId,
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  fullScreen,
  rendererConnected,
  fixtures,
  selectFixture,
  storage
}: Props) {
  const storageKey = React.useMemo(() => getStorageKey(projectId), [projectId]);
  const [width, setWidth] = React.useState(DEFAULT_WIDTH);

  // Read previous width from storage (usePreviousWidth)
  React.useEffect(() => {
    storage.getItem(storageKey).then(prevWidth => {
      if (prevWidth) {
        setWidth(prevWidth);
      }
    });
  }, [storageKey, storage]);

  const handleWidthChange = React.useCallback(
    (newWidth: number) => {
      const validWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth));
      setWidth(validWidth);
      storage.setItem(storageKey, validWidth);
    },
    [storageKey, storage]
  );

  const dragElRef = useDrag({ value: width, onChange: handleWidthChange });

  if (fullScreen) {
    return null;
  }

  if (!rendererConnected) {
    return <Container style={{ width }} />;
  }

  return (
    <Container data-testid="nav" style={{ width }}>
      <Scrollable>
        <FixtureTree
          projectId={projectId}
          fixturesDir={fixturesDir}
          fixtureFileSuffix={fixtureFileSuffix}
          fixtures={fixtures}
          selectedFixtureId={selectedFixtureId}
          onSelect={fixtureId => selectFixture(fixtureId, false)}
          storage={storage}
        />
      </Scrollable>
      <DragHandle ref={dragElRef} />
    </Container>
  );
}

function getStorageKey(projectId: string) {
  return `cosmos-navWidth-${projectId}`;
}

const Container = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 256px;
  height: 100%;
  background: var(--grey1);
  border-right: 1px solid var(--darkest);
`;

const Scrollable = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  right: -3px;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
`;
