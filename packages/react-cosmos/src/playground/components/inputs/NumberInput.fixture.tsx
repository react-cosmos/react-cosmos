import { blue } from 'chalk';
import React from 'react';
import styled from 'styled-components';
import { useValue } from '../../../renderer/useValue/index.js';
import { grey248, grey8 } from '../../style/colors.js';
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
  const [nr1, setNr1] = useValue<number>('number1', { defaultValue: 0.93 });
  const [nr2, setNr2] = useValue<number>('number2', { defaultValue: 1337 });
  const [nr3, setNr3] = useValue<number>('number3', { defaultValue: 0 });
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
