import React from 'react';
import styled from 'styled-components';
import { DarkButton, DarkIconButton } from '.';
import { CopyIcon, RefreshCwIcon } from '../../icons';
import { grey32 } from '../colors';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const DarkBg = styled(Row)`
  padding: 8px;
  background: ${grey32};
`;

export default (
  <>
    <DarkBg>
      <DarkIconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <DarkIconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <DarkIconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <DarkIconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </DarkBg>
    <DarkBg>
      <DarkButton
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <DarkButton
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <DarkButton
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <DarkButton
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </DarkBg>
  </>
);
