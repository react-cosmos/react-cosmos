import React from 'react';
import styled from 'styled-components';
import { Minimize2Icon } from '../../../shared/icons';
import { Button } from '../../../shared/ui/buttons';
import { Device, Viewport } from '../public';
import { NumberInput } from '../../../shared/ui/inputs/NumberInput';

type Props = {
  devices: Device[];
  selectedViewport: Viewport;
  scaleFactor: number;
  scaled: boolean;
  selectViewport: (viewport: Viewport) => unknown;
  toggleScale: () => unknown;
};

export class Header extends React.Component<Props> {
  render() {
    const {
      devices,
      selectedViewport,
      scaleFactor,
      scaled,
      selectViewport,
      toggleScale
    } = this.props;
    const canScale = scaleFactor < 1;
    return (
      <Container data-testid="responsiveHeader">
        <Left>
          <select
            data-testid="viewportSelect"
            value={stringifyViewport(selectedViewport)}
            onChange={e => selectViewport(parseViewport(e.target.value))}
          >
            {devices.map(({ label, width, height }, idx) => {
              const isSelected =
                selectedViewport &&
                selectedViewport.width === width &&
                selectedViewport.height === height;
              return (
                <option
                  key={idx}
                  value={stringifyViewport({ width, height })}
                  disabled={isSelected}
                >
                  {label}
                </option>
              );
            })}
          </select>
        </Left>
        <Right>
          <ViewportSize>
            <NumberInput
              id="viewport-width"
              value={selectedViewport.width}
              minValue={1}
              maxValue={5120}
              onChange={width => selectViewport({ ...selectedViewport, width })}
            />
            <ViewportX>×</ViewportX>
            <NumberInput
              id="viewport-width"
              value={selectedViewport.height}
              minValue={1}
              maxValue={5120}
              onChange={height =>
                selectViewport({ ...selectedViewport, height })
              }
            />
          </ViewportSize>
          <Button
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
}

function stringifyViewport({ width, height }: Viewport) {
  return `${width}x${height}`;
}

function parseViewport(str: string) {
  const [width, height] = str.split('x');
  return { width: Number(width), height: Number(height) };
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
  margin-left: 8px;
  color: var(--grey3);
`;

const ViewportX = styled.div`
  padding: 0 1px;
  line-height: 32px;
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
