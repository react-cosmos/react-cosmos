import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 400px;
  height: 400px;
`;

export default (
  <Container>
    <Image src="/fixture-list.png" alt="Fixture tree view" />
    <p>Browse components using your existing file structure.</p>
    <Image src="/fixture-search.png" alt="Global fixture search" />
    <p> ⌘ + P from anywhere to search for a component fixture.</p>
    <Image src="/props-panel.png" alt="Props input panel" />
    <p> Test prop values in real time using auto inferred input types.</p>
    <Image src="/responsive-mode.png" alt="Responsive preview mode" />
    <p> Render components under any screen size.</p>
  </Container>
);
