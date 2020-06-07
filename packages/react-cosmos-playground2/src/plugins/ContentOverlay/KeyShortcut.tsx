import React from 'react';
import styled from 'styled-components';
import { screenGrey1, screenGrey5 } from '../../shared/colors';
import { KeyBox } from '../../shared/KeyBox';

type Props = {
  keys: string[];
  label: string;
};

export function KeyShortcut({ keys, label }: Props) {
  return (
    <Container>
      <Keys>
        {keys.map(key => (
          <KeyBox
            key={key}
            value={key}
            bgColor={screenGrey5}
            textColor={screenGrey1}
            size={26}
            fontSize={16}
          />
        ))}
      </Keys>
      <Label>{label}</Label>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 26px;
  margin: 0 0 16px 0;
  line-height: 26px;

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
  flex: 1.4;
  text-indent: 10px;
`;
