import styled from 'styled-components';

export const Center = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;

export const SlideIn = styled.div<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: translate(0, ${props => (props.visible ? 0 : 40)}px);
  transition: 0.8s opacity, 1.2s transform;
`;
