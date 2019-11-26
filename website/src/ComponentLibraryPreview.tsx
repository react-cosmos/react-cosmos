import React from 'react';
import { FixtureTree } from 'react-cosmos-playground2/src/plugins/FixtureTree/FixtureTree';
import { TreeExpansion } from 'react-cosmos-playground2/src/shared/ui/TreeView';
import { stringifyFixtureId } from 'react-cosmos-playground2/src/shared/ui/valueInputTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';

const fixtures = {
  'Berries.ts': ['Strawberry', 'Raspberry', 'Blueberry'],
  'Avocado.ts': null,
  'Banana.ts': null,
  'Beans.ts': null,
  'Watermelon.ts': null
};
const initialFixtureId = { path: 'Berries.ts', name: 'Blueberry' };
const initialTreeExpansion = { Berries: true };

export function ComponentLibraryPreview() {
  const [fixtureId, setFixtureId] = React.useState<FixtureId>(initialFixtureId);
  const [treeExpansion, setTreeExpansion] = React.useState<TreeExpansion>(
    initialTreeExpansion
  );
  const shape = getShape(fixtureId);

  return (
    <Container>
      <Nav>
        <FixtureTree
          fixturesDir="__fixtures__"
          fixtureFileSuffix="fixture"
          fixtures={fixtures}
          selectedFixtureId={fixtureId}
          treeExpansion={treeExpansion}
          onSelect={setFixtureId}
          setTreeExpansion={setTreeExpansion}
        />
      </Nav>
      <Preview>
        <svg viewBox="0 0 600 600">
          <g transform="translate(300,300)">
            <path d={shape.d} fill={shape.color} />
          </g>
        </svg>
      </Preview>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Nav = styled.div`
  width: 240px;
  max-width: 50%;
  background: rgb(32, 32, 32);
`;

const Preview = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e1e1e1;
  overflow: hidden;

  svg {
    width: 100%;
    min-width: 480px;
  }

  path {
    transition: d 0.4s;
  }
`;

function getShape(fixtureId: FixtureId) {
  const str = stringifyFixtureId(fixtureId);
  switch (str) {
    case 'Berries.ts-Raspberry':
      return {
        d:
          'M94.7,-91.8C115.3,-74,119.7,-37,120.3,0.5999999999999996C120.9,38.2,117.7,76.4,97,93.5C76.4,110.7,38.2,106.9,6.7,100.1C-24.7,93.4,-49.5,83.8,-70.8,66.7C-92.2,49.5,-110.1,24.7,-120,-9.9C-129.9,-44.5,-131.8,-89.1,-110.4,-106.9C-89.1,-124.8,-44.5,-115.9,-3.8,-112.1C37,-108.3,74,-109.7,94.7,-91.8Z',
        color: '#F78DA7'
      };
    case 'Berries.ts-Strawberry':
      return {
        d:
          'M100.4,-106.9C119.7,-81.1,117.9,-40.5,124.7,6.8C131.5,54.2,147.1,108.4,127.8,144.3C108.4,180.1,54.2,197.5,14.600000000000001,182.9C-25,168.3,-50,121.6,-82.3,85.8C-114.6,50,-154.3,25,-167.8,-13.4C-181.2,-51.9,-168.4,-103.7,-136,-129.5C-103.7,-155.4,-51.9,-155.2,-5.7,-149.5C40.5,-143.9,81.1,-132.7,100.4,-106.9Z',
        color: '#EB144C'
      };
    case 'Berries.ts-Blueberry':
      return {
        d:
          'M85.5,-85.8C113.5,-57.5,140.8,-28.8,140.6,-0.09999999999999964C140.5,28.5,113,57,85,83.9C57,110.7,28.5,135.9,-10.8,146.7C-50.2,157.5,-100.4,154.1,-139.1,127.2C-177.7,100.4,-204.9,50.2,-205.2,-0.3999999999999986C-205.6,-50.9,-179.2,-101.8,-140.5,-130.2C-101.8,-158.5,-50.9,-164.2,-11.099999999999998,-153.2C28.8,-142.1,57.5,-114.2,85.5,-85.8Z',
        color: '#5000CA'
      };
    case 'Avocado.ts':
      return {
        d:
          'M127.4,-125.9C164.7,-90,194.4,-45,195.6,1.3000000000000007C196.9,47.6,169.9,95.2,132.6,121.6C95.2,147.9,47.6,152.9,9.2,143.8C-29.2,134.6,-58.5,111.1,-77.6,84.8C-96.8,58.5,-105.9,29.2,-118.6,-12.7C-131.3,-54.7,-147.7,-109.4,-128.5,-145.2C-109.4,-181,-54.7,-198,-4.799999999999999,-193.2C45,-188.4,90,-161.7,127.4,-125.9Z',
        color: '#7BDCB5'
      };
    case 'Banana.ts':
      return {
        d:
          'M137.7,-154.2C158.6,-116.9,141.8,-58.5,143.9,2.0999999999999996C146,62.7,167.1,125.4,146.2,165.9C125.4,206.4,62.7,224.7,8.500000000000002,216.2C-45.7,207.7,-91.5,172.5,-123.5,132C-155.5,91.5,-173.7,45.7,-171.5,2.1999999999999993C-169.2,-41.2,-146.5,-82.5,-114.5,-119.8C-82.5,-157.2,-41.2,-190.6,8.600000000000001,-199.2C58.5,-207.8,116.9,-191.6,137.7,-154.2Z',
        color: '#FCB900'
      };
    case 'Beans.ts':
      return {
        d:
          'M77.9,-86.4C93,-62.7,92,-31.3,91,-1.0999999999999996C89.9,29.200000000000003,88.8,58.5,73.6,90C58.5,121.5,29.200000000000003,155.2,-12.399999999999999,167.6C-54,180,-108,171,-123,139.5C-138,108,-114,54,-109.4,4.600000000000001C-104.80000000000001,-44.8,-119.6,-89.6,-104.6,-113.2C-89.6,-136.9,-44.8,-139.5,-6.7,-132.7C31.3,-126,62.7,-110,77.9,-86.4Z',
        color: '#273036'
      };
    case 'Watermelon.ts':
    default:
      return {
        d:
          'M161.7,-149.4C205.5,-117.9,234.3,-58.9,236.6,2.4000000000000004C239,63.6,214.9,127.3,171.1,158.1C127.3,188.9,63.6,187,-2.2,189.2C-68.1,191.5,-136.2,197.9,-177.9,167.1C-219.6,136.2,-234.8,68.1,-229.1,5.7C-223.5,-56.8,-196.9,-113.6,-155.3,-145.1C-113.6,-176.6,-56.8,-182.8,1.1,-183.9C58.9,-184.9,117.9,-180.9,161.7,-149.4Z',
        color: '#00D084'
      };
  }
}
