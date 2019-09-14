import React from 'react';
import styled from 'styled-components';
import { getColor, ColorType, ColorShade } from '../../shared/ui/colors';

const TILE_WIDTH = 224;
const TILE_BORDER_RADIUS = 4;
const TILE_PADDING = 24;

export default (
  <>
    <ColorPreview colorType="neutral" />
    <ColorPreview colorType="primary" />
  </>
);

function ColorPreview({ colorType }: { colorType: ColorType }) {
  return (
    <ColorPreviewContainer>
      <ColorName>{colorType}</ColorName>
      <Tiles>
        <ColorTile colorType={colorType} colorShade={0} />
        <ColorTile colorType={colorType} colorShade={1} />
        <ColorTile colorType={colorType} colorShade={2} />
        <ColorTile colorType={colorType} colorShade={3} />
        <ColorTile colorType={colorType} colorShade={4} />
        <ColorTile colorType={colorType} colorShade={5} />
        <ColorTile colorType={colorType} colorShade={6} />
        <ColorTile colorType={colorType} colorShade={7} />
        <ColorTile colorType={colorType} colorShade={8} />
        <ColorTile colorType={colorType} colorShade={9} />
      </Tiles>
    </ColorPreviewContainer>
  );
}

const ColorPreviewContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: calc((${TILE_WIDTH}px + ${TILE_PADDING}px) * 5);
  padding: 0 ${TILE_PADDING}px 0 0;
  background: #fff;
`;

const ColorName = styled.div`
  padding: ${TILE_PADDING}px 0 ${TILE_PADDING}px
    ${TILE_PADDING + TILE_BORDER_RADIUS}px;
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
  color: ${getColor('neutral', 0)};
  text-transform: capitalize;
`;

const Tiles = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function ColorTile({
  colorType,
  colorShade
}: {
  colorType: ColorType;
  colorShade: ColorShade;
}) {
  const color = getColor(colorType, colorShade);
  return (
    <Tile>
      <Color backgroundColor={color} />
      <Info>{color}</Info>
    </Tile>
  );
}

const Tile = styled.div`
  flex-shrink: 0;
  width: ${TILE_WIDTH}px;
  display: flex;
  margin: 0 0 ${TILE_PADDING}px ${TILE_PADDING}px;
  flex-direction: column;
`;

const Color = styled.div<{ backgroundColor: string }>`
  height: 80px;
  border-radius: ${TILE_BORDER_RADIUS}px;
  background: ${props => props.backgroundColor};
`;

const Info = styled.div`
  padding: 12px 0 0 ${TILE_BORDER_RADIUS}px;
  font-size: 16px;
  line-height: 16px;
  color: ${getColor('neutral', 1)};
`;
