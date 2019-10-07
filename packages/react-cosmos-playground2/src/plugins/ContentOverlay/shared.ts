import { PluginContext } from 'react-plugin';
import styled from 'styled-components';
import {
  deprecated_grey1,
  deprecated_grey2,
  deprecated_grey5,
  deprecated_grey6,
  deprecated_primary3,
  deprecated_primary4
} from '../../shared/ui/colors';
import { ContentOverlaySpec } from './public';

export type ContentOverlayContext = PluginContext<ContentOverlaySpec>;

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
  background-color: ${deprecated_grey6};
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuMDMyKSI+PHBhdGggb3BhY2l0eT0iLjUiIGQ9Ik05NiA5NWg0djFoLTR2NGgtMXYtNGgtOXY0aC0xdi00aC05djRoLTF2LTRoLTl2NGgtMXYtNGgtOXY0aC0xdi00aC05djRoLTF2LTRoLTl2NGgtMXYtNGgtOXY0aC0xdi00aC05djRoLTF2LTRIMHYtMWgxNXYtOUgwdi0xaDE1di05SDB2LTFoMTV2LTlIMHYtMWgxNXYtOUgwdi0xaDE1di05SDB2LTFoMTV2LTlIMHYtMWgxNXYtOUgwdi0xaDE1di05SDB2LTFoMTVWMGgxdjE1aDlWMGgxdjE1aDlWMGgxdjE1aDlWMGgxdjE1aDlWMGgxdjE1aDlWMGgxdjE1aDlWMGgxdjE1aDlWMGgxdjE1aDlWMGgxdjE1aDR2MWgtNHY5aDR2MWgtNHY5aDR2MWgtNHY5aDR2MWgtNHY5aDR2MWgtNHY5aDR2MWgtNHY5aDR2MWgtNHY5aDR2MWgtNHY5em0tMSAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tOS0xMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em05LTEwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tOS0xMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em05LTEwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tOS0xMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em05LTEwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tMTAgMHYtOWgtOXY5aDl6bS0xMCAwdi05aC05djloOXptLTEwIDB2LTloLTl2OWg5em0tOS0xMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5em0xMCAwaDl2LTloLTl2OXptMTAgMGg5di05aC05djl6bTEwIDBoOXYtOWgtOXY5eiIgLz48cGF0aCBkPSJNNiA1VjBINXY1SDB2MWg1djk0aDFWNmg5NFY1SDZ6IiAvPjwvZz48L2c+PC9zdmc+Cg==');
  background-size: 136px 136px;
  background-repeat: repeat;
  background-position: calc(50% - 10px) calc(50% - 10px);
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
  color: ${deprecated_grey1};

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
  background: ${deprecated_grey5};
  color: ${deprecated_grey2};
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  line-height: var(--size);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  outline: none;

  :focus {
    color: ${deprecated_primary3};
    box-shadow: 0 0 0px 2px ${deprecated_primary4};
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;
