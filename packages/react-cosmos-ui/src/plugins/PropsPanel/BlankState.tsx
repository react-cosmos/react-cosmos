import React from 'react';
import { DelayRender } from 'react-cosmos-core';
import styled from 'styled-components';
import { SlidersIcon } from '../../components/icons/index.js';
import { grey160, grey224, grey32, grey64 } from '../../style/colors.js';

export function BlankState() {
  return (
    <DelayRender delay={500}>
      <Container>
        <IconContainer>
          <SlidersIcon />
        </IconContainer>
        <Title>
          No visible props in <NoWrap>selected fixture</NoWrap>
        </Title>
        <Description>
          Props of exported JSX <NoWrap>elements from</NoWrap> your fixtures{' '}
          <NoWrap>will appear here.</NoWrap>
        </Description>
      </Container>
    </DelayRender>
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
  margin: 0 0 16px 0;
  color: ${grey224};
  text-align: center;
  font-weight: 500;
`;

const Description = styled.div`
  margin: 0 auto;
  max-width: 256px;
  color: ${grey160};
  text-align: center;
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;
