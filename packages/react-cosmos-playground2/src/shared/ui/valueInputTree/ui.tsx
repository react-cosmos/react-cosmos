import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  :first-child {
    border-top: none;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 12px 0 16px;
  line-height: 32px;
`;

type TitleProps = {
  label: string;
  componentName: string;
};

export function Title({ label, componentName }: TitleProps) {
  return (
    <TitleContainer>
      <strong>{label}</strong>
      <ComponentName>
        {componentName ? componentName : <em>Unnamed</em>}
      </ComponentName>
    </TitleContainer>
  );
}

const TitleContainer = styled.div`
  color: var(--grey4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  strong {
    font-weight: 500;
    color: var(--grey5);
  }
`;

const ComponentName = styled.span`
  padding: 0 8px;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Body = styled.div`
  padding: 4px 12px 8px 16px;
`;
