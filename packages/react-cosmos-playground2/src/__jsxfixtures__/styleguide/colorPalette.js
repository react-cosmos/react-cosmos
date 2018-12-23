// @flow

import React from 'react';
import styled from 'styled-components';

const Colors = styled.div`
  display: flex;
  padding: 24px 24px 0 0;
`;

const Color = styled.div`
  --size: 48px;
  width: var(--size);
  height: var(--size);
  margin: 0 0 0 24px;
  border-radius: 5px;
  background: ${props => props.backgroundColor || '#fff'};
  box-shadow: inset 0.5px 1px 3px rgba(0, 0, 0, 0.2);
`;

const COLOR_TYPES = [
  'primary',
  'grey',
  'accent',
  'success',
  'warning',
  'error'
];

export default (
  <>
    {COLOR_TYPES.map(colorType => (
      <Colors key={colorType}>
        <Color backgroundColor={`var(--${colorType}1)`} />
        <Color backgroundColor={`var(--${colorType}2)`} />
        <Color backgroundColor={`var(--${colorType}3)`} />
        <Color backgroundColor={`var(--${colorType}4)`} />
        <Color backgroundColor={`var(--${colorType}5)`} />
        <Color backgroundColor={`var(--${colorType}6)`} />
        <Color backgroundColor={`var(--${colorType}7)`} />
      </Colors>
    ))}
  </>
);
