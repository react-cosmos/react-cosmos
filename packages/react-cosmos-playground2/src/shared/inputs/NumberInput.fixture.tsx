import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import styled from 'styled-components';
import { blue, grey248, grey8 } from '../colors';
import { Space } from '../Space';
import { NumberInput, NumberInputStyles } from './NumberInput';

const styles: NumberInputStyles = {
  focusedColor: grey248,
  focusedBg: grey8,
  focusedBoxShadow: `0 0 0.5px 1px ${blue}`,
};

const Container = styled.div`
  padding: 8px;
`;

export default () => {
  const [int, setInt] = useValue<number>('int', { defaultValue: 1337 });
  const [float, setFloat] = useValue<number>('float', { defaultValue: 0.93 });
  return (
    <Container>
      <NumberInput value={int} styles={styles} onChange={setInt} />
      <Space height={8} />
      <NumberInput value={float} styles={styles} onChange={setFloat} />
    </Container>
  );
};
