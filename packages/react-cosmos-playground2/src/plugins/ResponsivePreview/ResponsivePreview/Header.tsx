import React from 'react';
import styled from 'styled-components';
import { Minimize2Icon } from '../../../shared/icons';
import { DarkButton } from '../../../shared/ui/buttons';
import { Device, Viewport } from '../public';
import { NumberInput } from '../../../shared/ui/inputs/NumberInput';
import { Select } from '../../../shared/ui/inputs/Select';

type Props = {
  devices: Device[];
  selectedViewport: Viewport;
  scaleFactor: number;
  scaled: boolean;
  selectViewport: (viewport: Viewport) => unknown;
  toggleScale: () => unknown;
};

const numberInputStypes = {
  focusedColor: 'var(--grey2)',
  focusedBg: 'var(--grey7)',
  focusedBoxShadow: '0 0 1px 1px var(--primary4)'
};

export function Header({
  devices,
  selectedViewport,
  scaleFactor,
  scaled,
  selectViewport,
  toggleScale
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
          onChange={option =>
            selectViewport({ width: option.width, height: option.height })
          }
        />
      </Left>
      <Right>
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
        <DarkButton
          icon={<Minimize2Icon />}
          label={
            <>
              scale
              {canScale && (
                <ScaleDegree>{getScalePercent(scaleFactor)}</ScaleDegree>
              )}
            </>
          }
          disabled={!canScale}
          selected={canScale && scaled}
          onClick={toggleScale}
        />
      </Right>
    </Container>
  );
}

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
  padding: 4px 4px 8px 4px;
  white-space: nowrap;
  overflow-x: auto;
`;

const Left = styled.div`
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled.div`
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > button {
    margin-left: 4px;

    :first-child {
      margin-left: 0;
    }
  }
`;

const ViewportSize = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 2px;
  color: var(--grey2);
`;

const ViewportX = styled.div`
  padding: 0 1px;
  line-height: 32px;
  color: var(--grey3);
`;

const ScaleDegree = styled.span`
  margin-left: 3px;
  color: var(--grey3);

  ::before {
    content: '(';
  }
  ::after {
    content: ')';
  }
`;
