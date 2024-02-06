import React from 'react';
import { useSelect } from 'react-cosmos/client';

const planets = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
];

const exoplanets = ['Kepler-51 b', 'Kepler-51 c', 'Kepler-51 d'];

export default () => {
  const [planet] = useSelect('planet', {
    options: [
      { group: 'Solar System', options: planets },
      { group: 'Exoplanets', options: exoplanets },
    ],
  });
  return <code>{planet}</code>;
};
