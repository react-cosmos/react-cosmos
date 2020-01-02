import React from 'react';
import styled from 'styled-components';
import { Select } from './Select';

const planets = [
  { value: 'Mercury', label: 'Mercury' },
  { value: 'Venus', label: 'Venus' },
  { value: 'Earth', label: 'Earth' },
  { value: 'Mars', label: 'Mars' },
  { value: 'Jupiter', label: 'Jupiter' },
  { value: 'Saturn', label: 'Saturn' },
  { value: 'Uranus', label: 'Uranus' },
  { value: 'Neptune', label: 'Neptune' }
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
        onChange={option => setPlanet(option.value)}
      />
    </Container>
  );
};
