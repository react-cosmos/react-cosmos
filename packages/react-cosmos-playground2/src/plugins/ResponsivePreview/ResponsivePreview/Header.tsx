import React from 'react';
import styled from 'styled-components';
import { Button8 } from '../../../shared/buttons';
import { blue, grey128, grey248, grey8 } from '../../../shared/colors';
import { Minimize2Icon } from '../../../shared/icons';
import { NumberInput } from '../../../shared/inputs/NumberInput';
import { Select } from '../../../shared/inputs/Select';
import { Device, Viewport } from '../public';

type Props = {
  devices: Device[];
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
      <ViewportSize>
        <NumberInput
          value={selectedViewport.width}
          minValue={1}
          maxValue={5120}
          styles={numberInputStypes}
          onChange={width => selectViewport({ ...selectedViewport, width })}
        />
        <ViewportX>×</ViewportX>
        <NumberInput
          value={selectedViewport.height}
          minValue={1}
          maxValue={5120}
          styles={numberInputStypes}
          onChange={height => selectViewport({ ...selectedViewport, height })}
        />
      </ViewportSize>
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
  justify-content: space-between;
  padding: 4px;
  background: ${grey8};
  white-space: nowrap;
  overflow-x: auto;
`;

const ViewportSize = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 2px;
`;

const ViewportX = styled.div`
  padding: 0 1px;
  line-height: 32px;
  color: ${grey128};
`;
