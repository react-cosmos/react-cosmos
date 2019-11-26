import React from 'react';
import { TreeExpansion } from 'react-cosmos-playground2/src/shared/ui/TreeView';
import { ValueInputTree } from 'react-cosmos-playground2/src/shared/ui/valueInputTree';
import {
  FixtureStatePrimitiveValueType,
  FixtureStateValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';
import styled from 'styled-components';

const initialTreeExpansion: TreeExpansion = { position: true };
const initialValues: FixtureStateValues = {
  color: {
    type: 'primitive',
    value: '#e7008a'
  },
  scale: {
    type: 'primitive',
    value: 129
  },
  rotate: {
    type: 'primitive',
    value: 72
  },
  blur: {
    type: 'primitive',
    value: true
  },
  blurRadius: {
    type: 'primitive',
    value: 5
  },
  position: {
    type: 'object',
    values: {
      x: {
        type: 'primitive',
        value: 6
      },
      y: {
        type: 'primitive',
        value: 22
      }
    }
  }
};

export function VisualTddPreview() {
  const [values, setValues] = React.useState(initialValues);
  const [treeExpansion, setTreeExpansion] = React.useState(
    initialTreeExpansion
  );

  const color = getPrimitiveValue(values.color, '#E7008A');

  const x = getObjectValue(values.position, 'x', false);
  const y = getObjectValue(values.position, 'y', false);
  const scale = getPrimitiveValue(values.scale, 100);
  const rotate = getPrimitiveValue(values.rotate, 0);
  const transform = `translate(${x}px, ${y}px) scale(${scale /
    100}) rotate(${rotate}deg)`;

  const blur = getPrimitiveValue(values.blur, false);
  const blurRadius = getPrimitiveValue(values.blurRadius, 0);
  const filter = blur ? `blur(${blurRadius}px)` : '';

  return (
    <Container>
      <Preview>
        <svg viewBox="0 0 600 600" style={{ transform, filter }}>
          <g transform="translate(300,300)">
            <path
              d="M63.6,-96.7C105.9,-71.7,179.8,-93.8,185.1,-84C190.3,-74.2,126.8,-32.6,108.1,7.199999999999999C89.3,46.9,115.3,84.7,108,94.2C100.7,103.7,60.1,85,27.1,96.7C-5.9,108.4,-31.3,150.6,-45.3,149C-59.4,147.3,-62.2,101.8,-67.6,71.8C-73,41.8,-81.1,27.299999999999997,-104.6,2.1999999999999993C-128.2,-22.9,-167.4,-58.6,-173.9,-94C-180.4,-129.3,-154.3,-164.4,-119.8,-193C-85.4,-221.6,-42.7,-243.8,-16,-218.8C10.600000000000001,-193.9,21.299999999999997,-121.8,63.6,-96.7Z"
              fill={color}
            />
          </g>
        </svg>
      </Preview>
      <Panel>
        <ValueInputTree
          id="values"
          values={values}
          treeExpansion={treeExpansion}
          onValueChange={setValues}
          onTreeExpansionChange={setTreeExpansion}
        />
      </Panel>
    </Container>
  );
}

function getPrimitiveValue<T extends FixtureStatePrimitiveValueType>(
  fsValue: FixtureStateValue,
  defaultValue: T
): T {
  if (fsValue.type !== 'primitive') return defaultValue;
  return fsValue.value as T;
}

function getObjectValue<T extends FixtureStatePrimitiveValueType>(
  fsValue: FixtureStateValue,
  valueName: string,
  defaultValue: T
): T {
  if (fsValue.type !== 'object') return defaultValue;

  const nestedFsValue = fsValue.values[valueName];
  if (nestedFsValue.type !== 'primitive') return defaultValue;

  return nestedFsValue.value as T;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Panel = styled.div`
  box-sizing: border-box;
  width: 240px;
  max-width: 50%;
  padding: 8px 8px 8px 16px;
  background: rgb(32, 32, 32);
`;

const Preview = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  svg {
    width: 100%;
    min-width: 480px;
  }

  path {
    transition: d 0.4s;
  }
`;
