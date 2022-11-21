import React from 'react';
import styled from 'styled-components';
import { KeyBox } from '../../components/KeyBox.js';
import { grey224, grey64, grey96 } from '../../style/colors.js';

export function FixtureSearchShortcuts() {
  return (
    <Container>
      <Column>
        <Shortcut
          keys={['↑', '↓']}
          label="Navigate"
          title="Navigate up and down through results"
        />
        <Shortcut keys={['Tab']} label="Cycle" title="Cycle through results" />
      </Column>
      <Column>
        <Shortcut
          keys={['Enter']}
          label="Open fixture"
          title="Open selected fixture"
        />
        <Shortcut
          keys={['Esc']}
          label="Close search"
          title="Close search modal"
        />
      </Column>
    </Container>
  );
}

const Container = styled.div`
  padding: 4px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: text;
`;

const Column = styled.div`
  flex: 1;
  padding: 0 0 8px 0;
  max-width: 224px;
  display: flex;
  flex-direction: column;
`;

type ShortcutProps = {
  keys: string[];
  label: string;
  title: string;
};

function Shortcut({ keys, label, title }: ShortcutProps) {
  return (
    <ShortcutContainer title={title}>
      <Keys>
        {keys.map(key => (
          <KeyBox key={key} value={key} bgColor={grey224} textColor={grey64} />
        ))}
      </Keys>
      <Label>{label}</Label>
    </ShortcutContainer>
  );
}

const ShortcutContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 24px;
  margin: 0 0 8px 0;
  padding: 0 10px;
  line-height: 24px;

  :last-child {
    margin-bottom: 0;
  }
`;

const Keys = styled.div`
  flex: 1;
  min-width: 53px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Label = styled.div`
  flex: 1.4;
  padding: 0 0 0 10px;
  color: ${grey96};
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
