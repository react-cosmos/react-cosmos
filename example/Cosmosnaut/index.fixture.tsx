import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import styled from 'styled-components';
import { Cosmosnaut } from './Cosmosnaut';

const CosmosnautContainer = styled.div`
  position: relative;
  width: 512px;
  height: 512px;
  img {
    width: 100%;
    height: 100%;
  }
`;

export default () => {
  const [transparency, setTransparency] = useValue('transparency', {
    defaultValue: false
  });
  return (
    <div onClick={() => setTransparency(!transparency)}>
      <CosmosnautContainer>
        <img src="/cosmos.png" />
        <div style={{ opacity: transparency ? 0.5 : 1 }}>
          <Cosmosnaut />
        </div>
      </CosmosnautContainer>
      <CosmosnautContainer>
        <img src="/cosmos.png" />
      </CosmosnautContainer>
    </div>
  );
};
