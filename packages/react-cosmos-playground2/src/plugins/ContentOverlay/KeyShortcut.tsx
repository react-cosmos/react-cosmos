import React from 'react';
import styled from 'styled-components';
import { screenGrey1, screenGrey5 } from '../../shared/ui/colors';

type Props = {
  keys: string[];
  label: string;
};

export function KeyShortcut({ keys, label }: Props) {
  return (
    <Container>
      <Keys>
        {keys.map((key) => (
          <KeyBox key={key}>{key}</KeyBox>
        ))}
      </Keys>
      <Label>{label}</Label>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 24px;
  margin: 8px 0 16px 0;
  line-height: 24px;

  :first-child {
    margin-top: 0;
  }

  :last-child {
    margin-bottom: 0;
  }
`;

const Keys = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Label = styled.div`
  flex: 1;
  text-indent: 10px;
`;

const KeyBox = styled.span`
  width: 24px;
  height: 24px;
  margin: 0 0 0 5px;
  background: ${screenGrey5};
  color: ${screenGrey1};
  border-radius: 5px;
  text-align: center;

  :first-child {
    margin-left: 0;
  }
`;
