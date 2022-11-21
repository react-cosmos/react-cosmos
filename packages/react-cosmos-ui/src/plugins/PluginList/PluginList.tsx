import React from 'react';
import styled from 'styled-components';
import {
  SidePanelContainer,
  SidePanelHeader,
  SidePanelTitle,
} from '../../components/SidePanel.js';
import { grey224 } from '../../style/colors.js';

export type SimplePlugin = {
  name: string;
  enabled: boolean;
};

type Props = {
  plugins: SimplePlugin[];
  enable: (pluginName: string, enabled: boolean) => void;
};

const requiredPlugins = [
  'core',
  'messageHandler',
  'rendererCore',
  'rendererPreview',
  'root',
  'router',
  'storage',
];

export function PluginList({ plugins, enable }: Props) {
  return (
    <SidePanelContainer>
      <SidePanelHeader>
        <SidePanelTitle label="Plugins" />
      </SidePanelHeader>
      <Body>
        {[...plugins]
          .sort((p1, p2) => p1.name.localeCompare(p2.name))
          .map(({ name, enabled }) => (
            <Label key={name}>
              <input
                disabled={requiredPlugins.indexOf(name) !== -1}
                type="checkbox"
                checked={enabled}
                onChange={e => enable(name, e.target.checked)}
              />
              <Name style={{ opacity: enabled ? 1 : 0.6 }}>{name}</Name>
            </Label>
          ))}
      </Body>
    </SidePanelContainer>
  );
}

const Body = styled.div`
  padding: 0 24px 20px 24px;
`;

const Label = styled.label`
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 24px;
`;

const Name = styled.span`
  margin-left: 8px;
  color: ${grey224};
  user-select: none;
`;
