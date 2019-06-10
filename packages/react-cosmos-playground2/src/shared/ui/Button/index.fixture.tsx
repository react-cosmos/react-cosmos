import React from 'react';
import styled from 'styled-components';
import { RefreshCwIcon, RotateCwIcon } from '../../../shared/icons';
import { Button, DarkButton, IconButton, DarkIconButton } from '.';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const LightBg = styled(Row)`
  padding: 8px;
  background: var(--grey6);
  color: var(--grey3);
`;

const DarkBg = styled(Row)`
  padding: 8px;
  background: var(--grey2);
  color: var(--grey6);
`;

export default (
  <>
    <LightBg>
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
    </LightBg>
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
    <LightBg>
      <Button
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <Button
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <Button
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <Button
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </LightBg>
    <DarkBg>
      <DarkButton
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={false}
        disabled={false}
        onClick={() => {}}
      />
      <DarkButton
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
      <DarkButton
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={true}
        disabled={false}
        onClick={() => {}}
      />
      <DarkButton
        title="Reset instance on every change"
        label="reset instance"
        icon={<RotateCwIcon />}
        selected={true}
        disabled={true}
        onClick={() => {}}
      />
    </DarkBg>
  </>
);
