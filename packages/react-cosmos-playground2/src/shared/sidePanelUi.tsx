import React from 'react';
import styled from 'styled-components';
import { grey128, grey160, grey32, white10 } from './colors';

export const Container = styled.div`
  background: ${grey32};
  border-top: 1px solid ${white10};

  :first-child {
    border-top: none;
  }
`;

export const Header = styled.div`
  height: 40px;
  padding: 0 4px 0 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

type TitleProps = {
  label: string;
  componentName?: string;
};

export function Title({ label, componentName }: TitleProps) {
  return (
    <TitleContainer>
      <TitleLabel>{label}</TitleLabel>
      {typeof componentName === 'string' && (
        <ComponentName>
          {componentName ? componentName : <em>Unnamed</em>}
        </ComponentName>
      )}
    </TitleContainer>
  );
}

const TitleContainer = styled.div`
  color: ${grey128};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TitleLabel = styled.span`
  text-transform: uppercase;
`;

const ComponentName = styled.span`
  padding-left: 8px;
  color: ${grey160};
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: row;

  > button {
    margin-left: 4px;

    :first-child {
      margin-left: 0;
    }
  }
`;

export const Body = styled.div`
  padding: 0 4px 8px 4px;
`;
