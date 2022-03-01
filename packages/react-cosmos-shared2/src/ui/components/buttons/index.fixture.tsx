import React from 'react';
import styled from 'styled-components';
import { Button32, IconButton32, IconButton8 } from '.';
import { grey32, grey8 } from '../colors';
import { CopyIcon, RefreshCwIcon } from '../icons';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Bg = styled(Row)`
  padding: 8px;

  > button {
    margin-right: 8px;
  }
`;

const Bg32 = styled(Bg)`
  background: ${grey32};
`;

const Bg8 = styled(Bg)`
  background: ${grey8};
`;

export default (
  <>
    <Bg32>
      <IconButton32
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <IconButton32
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <IconButton32
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <IconButton32
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </Bg32>
    <Bg8>
      <IconButton8
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <IconButton8
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <IconButton8
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <IconButton8
        title="Reset to initial values"
        icon={<RefreshCwIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </Bg8>
    <Bg32>
      <Button32
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <Button32
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <Button32
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <Button32
        title="Reuse instances on prop changes"
        label={'reuse instances'}
        icon={<CopyIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </Bg32>
  </>
);
