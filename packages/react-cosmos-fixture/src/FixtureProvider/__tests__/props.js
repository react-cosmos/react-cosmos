// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { updateState } from 'react-cosmos-shared2/util';
import {
  getFixtureStateProps,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { CaptureProps } from '../../CaptureProps';
import { FixtureProvider } from '../../FixtureProvider';

it('renders with props', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <HelloMessage name="Satoshi" />
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const [props1] = getFixtureStateProps(fixtureState);
  expect(props1).toEqual(getPropsInstanceShape('Satoshi'));
});

it('overwrites prop', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const createElement = () => (
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const instance = create(createElement());

  const [{ instanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(fixtureState, instanceId, {
      name: 'Vitalik'
    })
  });

  instance.update(createElement());

  expect(instance.toJSON()).toBe('Hello, Vitalik!');
});

it('removes prop', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const createElement = () => (
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const instance = create(createElement());

  const [{ instanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(fixtureState, instanceId, {})
  });

  instance.update(createElement());

  expect(instance.toJSON()).toBe('Hello, Guest!');
});

it('reverts to original props', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const createElement = () => (
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const instance = create(createElement());

  const [{ instanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(fixtureState, instanceId, {
      name: 'Vitalik'
    })
  });

  instance.update(createElement());

  expect(instance.toJSON()).toBe('Hello, Vitalik!');

  setFixtureState({ props: [] });

  instance.update(createElement());

  expect(instance.toJSON()).toBe('Hello, Satoshi!');

  // Not only does the fixture revert to original props, but it also
  // re-populates the fixture state
  const [props] = getFixtureStateProps(fixtureState);
  expect(props).toEqual(getPropsInstanceShape('Satoshi'));
});

it('reuses instance on props transition', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  let ref1;
  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref1 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  const [{ instanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(fixtureState, instanceId, {
      name: 'Vitalik'
    })
  });

  let ref2;
  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref2 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');

  expect(ref1).not.toBeFalsy();
  expect(ref1).toBe(ref2);
});

it('creates new instance on props reset', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const createElement = fixture => (
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  let ref1;
  const instance = create(
    createElement(
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref1 = ref;
          }
        }}
      />
    )
  );

  const [{ instanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(
      fixtureState,
      instanceId,
      { name: 'Vitalik' },
      true
    )
  });

  let ref2;
  instance.update(
    createElement(
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref2 = ref;
          }
        }}
      />
    )
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');

  expect(ref1).not.toBeFalsy();
  expect(ref1).not.toBe(ref2);
});

it('captures props from multiple instances (explicit capture)', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <CaptureProps>
        <HelloMessage name="Satoshi" />
      </CaptureProps>
      <CaptureProps>
        <HelloMessage name="Vitalik" />
      </CaptureProps>
    </FixtureProvider>
  );

  const [props1, props2] = getFixtureStateProps(fixtureState);
  expect(props1).toEqual(getPropsInstanceShape('Satoshi'));
  expect(props2).toEqual(getPropsInstanceShape('Vitalik'));
});

it('captures props from multiple instances (direct children)', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </FixtureProvider>
  );

  const [props1, props2] = getFixtureStateProps(fixtureState);
  expect(props1).toEqual(getPropsInstanceShape('Satoshi'));
  expect(props2).toEqual(getPropsInstanceShape('Vitalik'));
});

it('overwrites props in multiple instances', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const createElement = () => (
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <>
        <HelloMessage name="Satoshi" />
        <HelloMessage name="Vitalik" />
      </>
    </FixtureProvider>
  );

  const instance = create(createElement());

  const [props1, props2] = getFixtureStateProps(fixtureState);
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(fixtureState, props1.instanceId, {
      name: 'SATOSHI'
    })
  });
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(fixtureState, props2.instanceId, {
      name: 'VITALIK'
    })
  });

  instance.update(createElement());

  expect(instance.toJSON()).toEqual(['Hello, SATOSHI!', 'Hello, VITALIK!']);
});

it('renders replaced component type', () => {
  const createElement = MessageType => (
    <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
      <MessageType name="Satoshi" />
    </FixtureProvider>
  );

  const instance = create(createElement(HelloMessage));

  instance.update(createElement(YoMessage));

  expect(instance.toJSON()).toBe('Yo, Satoshi!');
});

it('overwrites fixture state on fixture change', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const createElement = name => (
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name={name} />
    </FixtureProvider>
  );

  const instance = create(createElement('Satoshi'));

  expect(instance.toJSON()).toBe('Hello, Satoshi!');

  const [{ instanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = updateState(fixtureState, {
    props: updateFixtureStateProps(fixtureState, instanceId, {
      name: 'Satoshi N.'
    })
  });

  // When using the same prop as initially, the fixture state takes priority
  instance.update(createElement('Satoshi'));

  expect(instance.toJSON()).toBe('Hello, Satoshi N.!');

  // When the fixture changes, however, the fixture state follows along
  instance.update(createElement('Vitalik'));

  const [props] = getFixtureStateProps(fixtureState);
  expect(props).toEqual(getPropsInstanceShape('Vitalik'));

  // Another update is required for the updated fixture state to pass down as
  // props.fixtureState
  instance.update(createElement('Vitalik'));

  expect(instance.toJSON()).toBe('Hello, Vitalik!');
});

// End of tests

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name || 'Guest'}!`;
  }
}

class YoMessage extends Component<{ name: string }> {
  render() {
    return `Yo, ${this.props.name || 'Guest'}!`;
  }
}

function getPropsInstanceShape(name) {
  return {
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}
