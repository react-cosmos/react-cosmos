import { blue } from 'chalk';
import React from 'react';
import styled from 'styled-components';
import { Button8 } from '../../../components/buttons';
import { Minimize2Icon, RefreshCcwIcon } from '../../../components/icons';
import { NumberInput } from '../../../components/inputs/NumberInput';
import { Select } from '../../../components/inputs/Select';
import { Space } from '../../../components/Space';
import {
  grey128,
  grey144,
  grey216,
  grey248,
  grey8,
} from '../../../style/colors';
import { quick } from '../../../style/vars';
import { ResponsiveDevice, Viewport } from '../spec';

type Props = {
  devices: ResponsiveDevice[];
  selectedViewport: Viewport;
  scaleFactor: number;
  scaled: boolean;
  selectViewport: (viewport: Viewport) => unknown;
  toggleScale: () => unknown;
};

const numberInputStypes = {
  focusedColor: grey248,
  focusedBg: grey8,
  focusedBoxShadow: `0 0 0.5px 1px ${blue}`,
};

export const Header = React.memo(function Header({
  devices,
  selectedViewport,
  scaleFactor,
  scaled,
  selectViewport,
  toggleScale,
}: Props) {
  const options = React.useMemo(
    () =>
      devices.map(({ width, height, label }) => {
        const value = stringifyViewport({ width, height });
        return { value, label, width, height };
      }),
    [devices]
  );
  const canScale = scaleFactor < 1;
  return (
    <Container data-testid="responsiveHeader">
      <Left>
        <Select
          testId="viewportSelect"
          options={options}
          value={stringifyViewport(selectedViewport)}
          color={grey248}
          height={32}
          padding={8}
          onChange={option =>
            selectViewport({ width: option.width, height: option.height })
          }
        />
      </Left>
      <Space width={4} />
      <Center>
        <NumberInput
          value={selectedViewport.width}
          minValue={0}
          maxValue={5120}
          styles={numberInputStypes}
          onChange={width => selectViewport({ ...selectedViewport, width })}
        />
        <ViewportX>×</ViewportX>
        <NumberInput
          value={selectedViewport.height}
          minValue={0}
          maxValue={5120}
          styles={numberInputStypes}
          onChange={height => selectViewport({ ...selectedViewport, height })}
        />
        <RotateButton
          title="Rotate"
          onClick={() =>
            selectViewport({
              width: selectedViewport.height,
              height: selectedViewport.width,
            })
          }
        >
          <RefreshCcwIcon size={14} />
        </RotateButton>
      </Center>
      <Space width={4} />
      <Right>
        {canScale ? (
          <Button8
            icon={<Minimize2Icon />}
            label={getScalePercent(scaleFactor)}
            title="Toggle fit to scale"
            disabled={false}
            selected={scaled}
            onClick={toggleScale}
          />
        ) : (
          <Button8
            icon={<Minimize2Icon />}
            label="100%"
            title="Toggle fit to scale"
            disabled={true}
            selected={false}
            onClick={() => {}}
          />
        )}
      </Right>
    </Container>
  );
});

function stringifyViewport({ width, height }: Viewport) {
  return `${width}x${height}`;
}

function getScalePercent(scaleFactor: number) {
  return `${Math.floor(scaleFactor * 100)}%`;
}

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  background: ${grey8};
  white-space: nowrap;
  overflow-x: auto;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const Center = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ViewportX = styled.div`
  padding: 0 1px;
  line-height: 32px;
  color: ${grey128};
`;

export const RotateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  color: ${grey144};
  outline: none;
  transition: color ${quick}s;

  :hover,
  :focus {
    color: ${grey216};
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;
