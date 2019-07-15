import React from 'react';
import { filter } from 'fuzzaldrin-plus';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  KEY_DOWN,
  KEY_ENTER,
  KEY_ESC,
  KEY_UP,
  KEY_TAB
} from '../../shared/keys';
import { FixtureSearchResult } from './FixtureSearchResult';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  onClose: () => unknown;
  onSelect: (fixtureId: FixtureId) => unknown;
};

// TODO: Try Slack's light search box design
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

  const [searchText, setSearchText] = React.useState('');
  const [matchingFixtureIds, setMatchingFixtureIds] = React.useState(
    fixtureIds
  );
  const [
    activeFixtureId,
    setActiveFixtureId
  ] = React.useState<null | FixtureId>(getFirstFixtureId(fixtureIds));

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchText = e.currentTarget.value;
      if (newSearchText !== searchText) {
        setSearchText(newSearchText);
        const newMatchingFixtureIds = getMatchingFixtureIds(
          fixtureIds,
          newSearchText
        );
        setMatchingFixtureIds(newMatchingFixtureIds);
        // Reset active fixture ID to first matching fixture Id when search changes
        setActiveFixtureId(getFirstFixtureId(newMatchingFixtureIds));
      }
    },
    [fixtureIds, searchText]
  );

  const onInputKeyDown = React.useMemo(() => {
    function handleEnter() {
      if (activeFixtureId !== null) {
        onSelect(activeFixtureId);
      }
    }

    function handleUp() {
      if (activeFixtureId) {
        const fixtureIndex = matchingFixtureIds.indexOf(activeFixtureId);
        if (fixtureIndex > 0) {
          setActiveFixtureId(matchingFixtureIds[fixtureIndex - 1]);
        }
      }
    }

    function handleDown() {
      if (activeFixtureId) {
        const fixtureIndex = matchingFixtureIds.indexOf(activeFixtureId);
        if (fixtureIndex < matchingFixtureIds.length - 1) {
          setActiveFixtureId(matchingFixtureIds[fixtureIndex + 1]);
        }
      }
    }

    function handleTab() {
      const matchingFixtureCount = matchingFixtureIds.length;
      if (matchingFixtureCount > 0) {
        if (!activeFixtureId) {
          setActiveFixtureId(matchingFixtureIds[0]);
        } else {
          const fixtureIndex = matchingFixtureIds.indexOf(activeFixtureId);
          const lastMatch = fixtureIndex === matchingFixtureCount - 1;
          if (lastMatch) {
            setActiveFixtureId(matchingFixtureIds[0]);
          } else {
            setActiveFixtureId(matchingFixtureIds[fixtureIndex + 1]);
          }
        }
      }
    }

    function handleTabReverse() {
      const matchingFixtureCount = matchingFixtureIds.length;
      if (matchingFixtureCount > 0) {
        if (!activeFixtureId) {
          setActiveFixtureId(matchingFixtureIds[matchingFixtureCount - 1]);
        } else {
          const fixtureIndex = matchingFixtureIds.indexOf(activeFixtureId);
          const lastMatch = fixtureIndex === 0;
          if (lastMatch) {
            setActiveFixtureId(matchingFixtureIds[matchingFixtureCount - 1]);
          } else {
            setActiveFixtureId(matchingFixtureIds[fixtureIndex - 1]);
          }
        }
      }
    }

    return (e: React.KeyboardEvent) => {
      switch (e.keyCode) {
        case KEY_ESC:
          e.preventDefault();
          return onClose();
        case KEY_ENTER:
          e.preventDefault();
          return handleEnter();
        case KEY_UP:
          e.preventDefault();
          return handleUp();
        case KEY_DOWN:
          e.preventDefault();
          return handleDown();
        case KEY_TAB:
          e.preventDefault();
          return e.shiftKey ? handleTabReverse() : handleTab();
        default:
        // Nada
      }
    };
  }, [activeFixtureId, matchingFixtureIds, onClose, onSelect]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto focus when search input is created
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 1. Prevent click propagation to overlay element (which calls onClose)
  // 2. Keep user focused on search input while search is open
  const onContentClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Overlay data-testid="fixtureSearchOverlay" onClick={onClose}>
      <Content data-testid="fixtureSearchContent" onClick={onContentClick}>
        <InputContainer>
          <input
            ref={inputRef}
            type="text"
            placeholder="Fixture search"
            value={searchText}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
        </InputContainer>
        <Results>
          {matchingFixtureIds.map((fixtureId, idx) => (
            <FixtureSearchResult
              key={idx}
              fixturesDir={fixturesDir}
              fixtureFileSuffix={fixtureFileSuffix}
              fixtureId={fixtureId}
              active={fixtureId === activeFixtureId}
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

function getFirstFixtureId(fixtureIds: FixtureId[]): null | FixtureId {
  return fixtureIds.length > 0 ? fixtureIds[0] : null;
}

function getMatchingFixtureIds(fixtureIds: FixtureId[], searchText: string) {
  if (searchText === '') {
    return fixtureIds;
  }

  const fixtureTexts: string[] = [];
  fixtureIds.forEach(fixtureId => {
    const { path, name } = fixtureId;
    fixtureTexts.push(name !== null ? `${path} ${name}` : path);
  });

  const results = filter(fixtureTexts, searchText);
  return results.map(r => fixtureIds[fixtureTexts.indexOf(r)]);
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
