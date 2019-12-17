import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';

export function StickyHeader() {
  const gradientRef = useGradientRef();
  const [visible, setVisible] = React.useState(false);
  const [fixed, setFixed] = React.useState(false);

  React.useEffect(() => {
    function update() {
      const gradientEl = gradientRef.current;
      if (gradientEl) {
        const { pageYOffset } = window;
        const { offsetTop } = gradientEl;
        setFixed(pageYOffset >= offsetTop);
        setVisible(pageYOffset >= offsetTop / 2);
      }
    }

    update();
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [gradientRef]);

  return (
    <Container>
      <Header visible={visible} fixed={fixed} />
    </Container>
  );
}

function useGradientRef() {
  const ref = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    ref.current = document.getElementById('gradient1');
  }, []);
  return ref;
}

const Container = styled.div`
  position: relative;
`;
