import React from 'react';
import styled from 'styled-components';

type Props = { width: number } | { height: number };

export function Space(props: Props) {
  return <StyledSpace style={props} />;
}

const StyledSpace = styled.div`
  flex-shrink: 0;
`;
