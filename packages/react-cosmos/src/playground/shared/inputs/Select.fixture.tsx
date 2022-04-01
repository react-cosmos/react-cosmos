import React from 'react';
import styled from 'styled-components';
import { grey248 } from '../../ui/colors';
import { Select } from './Select';

const planets = [
  { value: 'Mercury', label: 'Mercury' },
  { value: 'Venus', label: 'Venus' },
  { value: 'Earth', label: 'Earth' },
  { value: 'Mars', label: 'Mars' },
  { value: 'Jupiter', label: 'Jupiter' },
  { value: 'Saturn', label: 'Saturn' },
  { value: 'Uranus', label: 'Uranus' },
  { value: 'Neptune', label: 'Neptune' },
];

const Container = styled.div`
  padding: 8px;
`;

export default () => {
  const [planet, setPlanet] = React.useState('Earth');
  return (
    <Container>
      <Select
        options={planets}
        value={planet}
        color={grey248}
        height={32}
        padding={8}
        onChange={option => setPlanet(option.value)}
      />
    </Container>
  );
};
