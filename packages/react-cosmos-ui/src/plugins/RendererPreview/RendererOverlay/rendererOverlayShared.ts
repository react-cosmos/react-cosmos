import styled from 'styled-components';
import { grey192, grey32 } from '../../../style/colors.js';

export const RendererOverlayContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${grey32};
  height: 116px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

export const RendererOverlayIconWrapper = styled.div`
  height: 76px;
  display: flex;
  align-items: center;
`;

export const RendererOverlayMessage = styled.p`
  margin-bottom: 16px;
  color: ${grey192};
  text-transform: uppercase;
  white-space: nowrap;
`;
