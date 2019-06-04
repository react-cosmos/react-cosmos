import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background: var(--grey6);
  overflow-x: auto;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  padding: 0 32px;
  box-sizing: border-box;
`;

export const TextContainer = styled.div`
  flex-shrink: 0;
  width: 480px;
  padding: 0 32px 0 0;
  font-size: 16px;
  line-height: 1.5em;
  color: var(--grey1);

  strong {
    font-weight: 500;
  }
`;

export const IllustrationContainer = styled.div`
  --size: 320px;
  display: flex;
  width: var(--size);
  height: var(--size);
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;

export const Delay = styled.div`
  opacity: 0;
  animation: fadeIn var(--quick) linear 0.5s forwards;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
