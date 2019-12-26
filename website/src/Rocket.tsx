import React from 'react';
import styled from 'styled-components';
import { useViewportEnter } from './shared/useViewportEnter';

export function Rocket() {
  const [ref, entered] = useViewportEnter(0.66);
  const offset = entered ? 0 : 120;
  return (
    <Container
      ref={ref}
      style={{
        background: `rgba(10, 46, 70, ${entered ? 0.06 : 0})`
      }}
    >
      <StyledRocketSvg
        viewBox="0 0 24 24"
        style={{
          left: 46 - offset,
          top: 50 + offset
        }}
      >
        <path d="M8.566 17.842c-.945 2.462-3.678 4.012-6.563 4.161.139-2.772 1.684-5.608 4.209-6.563l.51.521c-1.534 1.523-2.061 2.765-2.144 3.461.704-.085 2.006-.608 3.483-2.096l.505.516zm-1.136-11.342c-1.778-.01-4.062.911-5.766 2.614-.65.649-1.222 1.408-1.664 2.258 1.538-1.163 3.228-1.485 5.147-.408.566-1.494 1.32-3.014 2.283-4.464zm5.204 17.5c.852-.44 1.61-1.013 2.261-1.664 1.708-1.706 2.622-4.001 2.604-5.782-1.575 1.03-3.125 1.772-4.466 2.296 1.077 1.92.764 3.614-.399 5.15zm11.312-23.956c-.428-.03-.848-.044-1.261-.044-9.338 0-14.465 7.426-16.101 13.009l4.428 4.428c5.78-1.855 12.988-6.777 12.988-15.993v-.059c-.002-.437-.019-.884-.054-1.341zm-5.946 7.956c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
      </StyledRocketSvg>
    </Container>
  );
}

const Container = styled.div`
  margin: 0 auto 96px auto;
  width: 192px;
  height: 192px;
  border-radius: 50%;
  transition: background 0.4s;
  overflow: hidden;
  /* https://stackoverflow.com/a/58283449/128816 */
  transform: translateZ(0);
`;

const StyledRocketSvg = styled.svg`
  position: relative;
  width: 100px;
  height: 100px;
  fill: currentColor;
  animation: hover 0.6s infinite ease;
  transition: left, 0.4s ease-out, bottom 0.4s ease-out;

  @keyframes hover {
    0% {
      transform: translateY(-0.6px) translateX(-0.6px);
    }
    25% {
      transform: translateX(0.6px) translateY(0.6px);
    }
    50% {
      transform: translateX(-0.6px) translateY(0.6px);
    }
    75% {
      transform: translateX(0.6px) translateY(-0.6px);
    }
    100% {
      transform: translateY(-0.6px) translateX(-0.6px);
    }
  }
`;
