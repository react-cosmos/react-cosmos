import { PluginContext } from 'react-plugin';
import styled from 'styled-components';
import { ContentOverlaySpec } from './public';
import { black70 } from '../../shared/ui/colors';

export type Context = PluginContext<ContentOverlaySpec>;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  align-items: flex-start;
  border-top: 1px solid ${black70};
  background: var(--grey6);
  overflow: auto;
`;

export const ContentContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  min-height: 100%;
  box-sizing: border-box;
`;

export const TextContainer = styled.div`
  flex-shrink: 0;
  width: 480px;
  padding: 32px;
  font-size: 16px;
  line-height: 1.5em;
  color: var(--grey1);

  strong {
    font-weight: 500;
  }
`;

export const IllustrationContainer = styled.div`
  flex-shrink: 0;
  --size: 320px;
  display: flex;
  width: var(--size);
  height: var(--size);
  padding: 0 16px;
`;

export const SecondaryButton = styled.button`
  display: inline-block;
  --size: 36px;
  height: var(--size);
  margin: 0 0 0 16px;
  padding: 0 16px;
  border: 0;
  background: var(--grey5);
  color: var(--grey2);
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  line-height: var(--size);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  outline: none;

  :focus {
    color: var(--primary3);
    box-shadow: 0 0 0px 2px var(--primary4);
  }

  ::-moz-focus-inner {
    border: 0;
  }
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
