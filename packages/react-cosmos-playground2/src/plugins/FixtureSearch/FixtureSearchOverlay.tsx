import { filter } from 'fuzzaldrin-plus';
import React from 'react';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { createFixtureTree } from '../../shared/fixtureTree';
import {
  KEY_DOWN,
  KEY_ENTER,
  KEY_ESC,
  KEY_TAB,
  KEY_UP
} from '../../shared/keys';
import { FixtureSearchResult } from './FixtureSearchResult';
import { FixtureIdsByPath, flattenFixtureTree } from './flattenFixtureTree';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  onClose: () => unknown;
  onSelect: (fixtureId: FixtureId) => unknown;
};

type ActiveFixturePath = null | string;

// TODO: Try Slack's light search box design
export function FixtureSearchOverlay({
  fixturesDir,
  fixtureFileSuffix,
  fixtures,
  onClose,
  onSelect
}: Props) {
  // Flattened fixture IDs are memoized purely to minimize computation
  const fixtureIds = React.useMemo(() => {
    const fixtureTree = createFixtureTree({
      fixtures,
      fixturesDir,
      fixtureFileSuffix
    });
    return flattenFixtureTree(fixtureTree);
  }, [fixtures, fixturesDir, fixtureFileSuffix]);

  const [searchText, setSearchText] = React.useState('');

  const [matchingFixturePaths, setMatchingFixturePaths] = React.useState(
    Object.keys(fixtureIds)
  );

  const [activeFixturePath, setActiveFixturePath] = React.useState<
    ActiveFixturePath
  >(getFirstFixturePath(matchingFixturePaths));

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchText = e.currentTarget.value;
      if (newSearchText !== searchText) {
        setSearchText(newSearchText);
        const newMatchingFixturePaths = getMatchingFixturePaths(
          fixtureIds,
          newSearchText
        );
        setMatchingFixturePaths(newMatchingFixturePaths);
        // Reset active fixture ID to first matching fixture Id when search changes
        setActiveFixturePath(getFirstFixturePath(newMatchingFixturePaths));
      }
    },
    [fixtureIds, searchText]
  );

  const onInputKeyDown = React.useMemo(() => {
    function handleEnter() {
      if (activeFixturePath !== null) {
        onSelect(fixtureIds[activeFixturePath]);
      }
    }

    function handleUp() {
      if (activeFixturePath) {
        const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
        if (fixtureIndex > 0) {
          setActiveFixturePath(matchingFixturePaths[fixtureIndex - 1]);
        }
      }
    }

    function handleDown() {
      if (activeFixturePath) {
        const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
        if (fixtureIndex < matchingFixturePaths.length - 1) {
          setActiveFixturePath(matchingFixturePaths[fixtureIndex + 1]);
        }
      }
    }

    function handleTab() {
      const matchingFixtureCount = matchingFixturePaths.length;
      if (matchingFixtureCount > 0) {
        if (!activeFixturePath) {
          setActiveFixturePath(matchingFixturePaths[0]);
        } else {
          const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
          const lastMatch = fixtureIndex === matchingFixtureCount - 1;
          if (lastMatch) {
            setActiveFixturePath(matchingFixturePaths[0]);
          } else {
            setActiveFixturePath(matchingFixturePaths[fixtureIndex + 1]);
          }
        }
      }
    }

    function handleTabReverse() {
      const matchingFixtureCount = matchingFixturePaths.length;
      if (matchingFixtureCount > 0) {
        if (!activeFixturePath) {
          setActiveFixturePath(matchingFixturePaths[matchingFixtureCount - 1]);
        } else {
          const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
          const lastMatch = fixtureIndex === 0;
          if (lastMatch) {
            setActiveFixturePath(
              matchingFixturePaths[matchingFixtureCount - 1]
            );
          } else {
            setActiveFixturePath(matchingFixturePaths[fixtureIndex - 1]);
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
  }, [fixtureIds, matchingFixturePaths, activeFixturePath, onClose, onSelect]);

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
          {matchingFixturePaths.map(cleanFixturePath => (
            <FixtureSearchResult
              key={cleanFixturePath}
              cleanFixturePath={cleanFixturePath}
              fixtureId={fixtureIds[cleanFixturePath]}
              active={cleanFixturePath === activeFixturePath}
              onSelect={onSelect}
            />
          ))}
        </Results>
      </Content>
    </Overlay>
  );
}

function getFirstFixturePath(fixturePaths: string[]): null | string {
  return fixturePaths.length > 0 ? fixturePaths[0] : null;
}

function getMatchingFixturePaths(
  fixtureIds: FixtureIdsByPath,
  searchText: string
): string[] {
  const fixturePaths = Object.keys(fixtureIds);

  if (searchText === '') {
    return fixturePaths;
  }

  const fixtureSearchTexts: string[] = [];
  fixturePaths.forEach(cleanFixturePath => {
    const fixtureId = fixtureIds[cleanFixturePath];
    const { path, name } = fixtureId;
    // Allow fixtures to be searched by their entire file path, suffixed by
    // their name in the case of named fixtures.
    fixtureSearchTexts.push(name !== null ? `${path} ${name}` : path);
  });

  const machingFixtureSearchTexts = filter(fixtureSearchTexts, searchText);
  return machingFixtureSearchTexts.map(fixtureSearchText => {
    const fixtureIndex = fixtureSearchTexts.indexOf(fixtureSearchText);
    return fixturePaths[fixtureIndex];
  });
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
