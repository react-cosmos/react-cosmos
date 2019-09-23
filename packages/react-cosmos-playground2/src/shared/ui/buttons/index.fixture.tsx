import React from 'react';
import styled from 'styled-components';
import { Button, IconButton } from '.';
import { CopyIcon, RefreshCwIcon } from '../../icons';
import { grey32 } from '../colors';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const DarkBg = styled(Row)`
  padding: 8px;
  background: ${grey32};

  > button {
    margin-right: 8px;
  }
`;

export default (
  <>
    <DarkBg>
      <IconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <IconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <IconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <IconButton
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </DarkBg>
    <DarkBg>
      <Button
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <Button
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <Button
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <Button
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
