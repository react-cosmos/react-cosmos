import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import styled from 'styled-components';
import { Cosmonaut } from './Cosmonaut';

const CosmonautContainer = styled.div`
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
      <CosmonautContainer>
        <img src="/cosmos.png" />
        <div style={{ opacity: transparency ? 0.5 : 1 }}>
          <Cosmonaut />
        </div>
      </CosmonautContainer>
      <CosmonautContainer>
        <img src="/cosmos.png" />
      </CosmonautContainer>
    </div>
  );
};
