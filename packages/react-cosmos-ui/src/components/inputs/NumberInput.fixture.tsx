import React from 'react';
import { useCosmosInput } from 'react-cosmos/client';
import styled from 'styled-components';
import { blue, grey248, grey8 } from '../../style/colors.js';
import { Space } from '../Space.js';
import { NumberInput, NumberInputStyles } from './NumberInput.js';

const styles: NumberInputStyles = {
  focusedColor: grey248,
  focusedBg: grey8,
  focusedBoxShadow: `0 0 0.5px 1px ${blue}`,
};

const Container = styled.div`
  padding: 8px;
`;

export default () => {
  const [nr1, setNr1] = useCosmosInput('number1', 0.93);
  const [nr2, setNr2] = useCosmosInput('number2', 1337);
  const [nr3, setNr3] = useCosmosInput('number3', 0);
  return (
    <Container>
      <NumberInput
        value={nr1}
        styles={styles}
        minValue={0}
        maxValue={100}
        onChange={setNr1}
      />
      <Space height={8} />
      <NumberInput
        value={nr2}
        styles={styles}
        minValue={-5000}
        maxValue={5000}
        onChange={setNr2}
      />
      <Space height={8} />
      <NumberInput value={nr3} styles={styles} onChange={setNr3} />
    </Container>
  );
};
