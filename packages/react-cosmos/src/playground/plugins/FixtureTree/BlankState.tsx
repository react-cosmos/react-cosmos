import React from 'react';
import styled from 'styled-components';
import { grey160, grey224, grey32, grey64, grey8 } from '../../core/colors';
import { FileIcon } from '../../ui/components/icons';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
};

export function BlankState({ fixturesDir, fixtureFileSuffix }: Props) {
  return (
    <Container data-testid="nav-blank-state">
      <IconContainer>
        <FileIcon />
      </IconContainer>
      <Title>
        No component <NoWrap>fixtures found</NoWrap>
      </Title>
      <Description>
        <ol>
          <li>
            Place fixture files under <code>{fixturesDir}</code> dirs or add the{' '}
            <code>.{fixtureFileSuffix}</code> suffix to{' '}
            <NoWrap>their name</NoWrap>
          </li>
          <li>
            Default exports from your fixtures (any React element or component){' '}
            will <NoWrap>appear here</NoWrap>
          </li>
        </ol>
      </Description>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px 24px;
  background: ${grey32};
  font-size: 14px;
  line-height: 22px;
`;

const iconSize = 32;

export const IconContainer = styled.div`
  margin: 16px auto;
  display: flex;
  width: ${iconSize}px;
  height: ${iconSize}px;
  color: ${grey64};
`;

const Title = styled.div`
  margin: 0 0 24px 0;
  color: ${grey224};
  text-align: center;
  font-weight: 500;
`;

const Description = styled.div`
  margin: 0 auto;
  max-width: 256px;
  color: ${grey160};
  text-align: left;

  ol {
    padding: 0 0 0 16px;
  }

  li {
    margin-bottom: 12px;
  }

  code {
    padding: 0 4px;
    border-radius: 3px;
    background: ${grey8};
    color: ${grey224};
    font-family: 'Dank Mono', Courier, monospace;
  }
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;
