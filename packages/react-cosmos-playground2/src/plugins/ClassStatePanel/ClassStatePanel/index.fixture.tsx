import React from 'react';
import styled from 'styled-components';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { Viewport } from 'react-cosmos-fixture';
import { stringifyElementId } from '../../../shared/ui/valueInputTree';
import { ClassStatePanel } from '.';

const Container = styled.div`
  background: var(--grey2);
`;

export default () => {
  const [fixtureState, setFixtureState] = React.useState<FixtureState>({
    classState: [
      {
        componentName: 'FooComponent',
        elementId: { decoratorId: 'root', elPath: 'props.children[0]' },
        values: {
          string: {
            type: 'primitive',
            value: 'hello world'
          },
          number: {
            type: 'primitive',
            value: 1337
          },
          boolean: {
            type: 'primitive',
            value: false
          },
          null: {
            type: 'primitive',
            value: null
          },
          unserializable: {
            type: 'unserializable',
            stringifiedValue: `<div>\n  <div />\n  <div />\n</div>`
          },
          unserializable2: {
            type: 'unserializable',
            stringifiedValue: `/whatyouseeiswhatyougetsometimes/i`
          }
        }
      },
      {
        componentName: '',
        elementId: { decoratorId: 'root', elPath: 'props.children[1]' },
        values: {
          array: {
            type: 'array',
            values: [
              {
                type: 'primitive',
                value: 'hello world'
              },
              {
                type: 'primitive',
                value: 1337
              },
              {
                type: 'primitive',
                value: false
              }
            ]
          },
          object: {
            type: 'object',
            values: {
              string: {
                type: 'primitive',
                value: 'hello world'
              },
              number: {
                type: 'primitive',
                value: 1337
              },
              boolean: {
                type: 'primitive',
                value: false
              }
            }
          },
          emptyObject: {
            type: 'object',
            values: {}
          },
          emptyArray: {
            type: 'array',
            values: []
          },
          string: {
            type: 'primitive',
            value: 'hello world hello world hello world hello world'
          },
          numberWithAVeryVeryVeeeryLongName: {
            type: 'primitive',
            value: 1337
          },
          boolean: {
            type: 'primitive',
            value: false
          }
        }
      }
    ]
  });
  const [fixtureExpansion, setFixtureExpansion] = React.useState({});

  return (
    <Container>
      <Viewport width={220} height={400}>
        <ClassStatePanel
          fixtureState={fixtureState}
          fixtureExpansion={fixtureExpansion}
          onFixtureStateChange={setFixtureState}
          onElementExpansionChange={(elementId, treeExpansion) => {
            setFixtureExpansion({
              ...fixtureExpansion,
              [stringifyElementId(elementId)]: treeExpansion
            });
          }}
        />
      </Viewport>
    </Container>
  );
};
