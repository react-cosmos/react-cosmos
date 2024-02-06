import React from 'react';
import styled from 'styled-components';
import { grey248 } from '../../style/colors.js';
import { Select } from './Select.js';

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

const exoplanets = [
  { value: 'Kepler-51 b', label: 'Kepler-51 b' },
  { value: 'Kepler-51 c', label: 'Kepler-51 c' },
  { value: 'Kepler-51 d', label: 'Kepler-51 d' },
];

const galactic = [
  {
    group: 'Solar System',
    options: planets,
  },
  {
    group: 'Exoplanets',
    options: exoplanets,
  },
];

const Container = styled.div`
  padding: 8px;
`;

export default {
  flat: function Flat() {
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
  },
  groups: function Groups() {
    const [planet, setPlanet] = React.useState('Earth');
    return (
      <Container>
        <Select
          options={galactic}
          value={planet}
          color={grey248}
          height={32}
          padding={8}
          onChange={option => setPlanet(option.value)}
        />
      </Container>
    );
  },
};
