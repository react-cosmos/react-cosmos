import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { ClassStatePanel } from '.';
import { stringifyElementId } from '../../../shared/valueInputTree';

export default () => {
  const [fixtureState, setFixtureState] = React.useState<FixtureState>({
    classState: [
      {
        componentName: 'FooComponent',
        elementId: { decoratorId: 'root', elPath: 'props.children[0]' },
        values: {
          string: {
            type: 'primitive',
            data: 'hello world',
          },
          number: {
            type: 'primitive',
            data: 1337,
          },
          boolean: {
            type: 'primitive',
            data: false,
          },
          null: {
            type: 'primitive',
            data: null,
          },
          unserializable: {
            type: 'unserializable',
            stringifiedData: `<div>\n  <div />\n  <div />\n</div>`,
          },
          unserializable2: {
            type: 'unserializable',
            stringifiedData: `/whatyouseeiswhatyougetsometimes/i`,
          },
        },
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
                data: 'hello world',
              },
              {
                type: 'primitive',
                data: 1337,
              },
              {
                type: 'primitive',
                data: false,
              },
            ],
          },
          object: {
            type: 'object',
            values: {
              string: {
                type: 'primitive',
                data: 'hello world',
              },
              number: {
                type: 'primitive',
                data: 1337,
              },
              boolean: {
                type: 'primitive',
                data: false,
              },
            },
          },
          emptyObject: {
            type: 'object',
            values: {},
          },
          emptyArray: {
            type: 'array',
            values: [],
          },
          string: {
            type: 'primitive',
            data: 'hello world hello world hello world hello world',
          },
          numberWithAVeryVeryVeeeryLongName: {
            type: 'primitive',
            data: 1337,
          },
          boolean: {
            type: 'primitive',
            data: false,
          },
        },
      },
    ],
  });
  const [fixtureExpansion, setFixtureExpansion] = React.useState({});

  return (
    <ClassStatePanel
      fixtureState={fixtureState}
      fixtureExpansion={fixtureExpansion}
      onFixtureStateChange={setFixtureState}
      onElementExpansionChange={(elementId, treeExpansion) => {
        setFixtureExpansion({
          ...fixtureExpansion,
          [stringifyElementId(elementId)]: treeExpansion,
        });
      }}
    />
  );
};
