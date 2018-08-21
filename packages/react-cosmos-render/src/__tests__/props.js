// @flow

import React, { Component, Fragment } from 'react';
import { create } from 'react-test-renderer';
import { CaptureProps } from '../CaptureProps';
import { FixtureProvider } from '../FixtureProvider';

import type { ComponentMetadata } from '../types';

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name || 'Guest'}!`;
  }
}

it('renders with props', () => {
  expect(
    create(
      <FixtureProvider>
        <HelloMessage name="Satoshi" />
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const [props] = instance.getInstance().state.fixtureState.props;
  expect(props).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'HelloMessage'
    },
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
});

it('overwrites prop', () => {
  const fixture = <HelloMessage name="Satoshi" />;
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);
  const [{ component }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');
});

it('removes prop', () => {
  const fixture = <HelloMessage name="Satoshi" />;
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);
  const [{ component }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getEmptyProps({ component })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Guest!');
});

// XXX: This is broken use case. CaptureProps will never update props in
// fixture state from this point on. It populates fixture props on mount, which
// means that props should only be reset together with changing renderKey
it('reverts to original props', () => {
  const fixture = <HelloMessage name="Satoshi" />;
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [{ component }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );
  instance.update(
    <FixtureProvider fixtureState={{ props: [] }}>{fixture}</FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Satoshi!');
});

it('reuses instance on props with same renderKey', () => {
  let ref1, ref2;

  const instance = create(
    <FixtureProvider>
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

  const { fixtureState } = instance.getInstance().state;
  const [{ component, renderKey }] = fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component, renderKey })]
      }}
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

  expect(ref1).not.toBeFalsy();
  expect(ref1).toBe(ref2);
});

it('creates new instance on props with different renderKey', () => {
  let ref1, ref2;

  const instance = create(
    <FixtureProvider>
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

  const { fixtureState } = instance.getInstance().state;
  const [{ component, renderKey }] = fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          getPropsWithName({
            name: 'Vitalik',
            component,
            renderKey: renderKey + 1
          })
        ]
      }}
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

  expect(ref1).not.toBeFalsy();
  expect(ref1).not.toBe(ref2);
});

it('captures props from multiple instances (explicit capture)', () => {
  const instance = create(
    <FixtureProvider>
      <CaptureProps>
        <HelloMessage name="Satoshi" />
      </CaptureProps>
      <CaptureProps>
        <HelloMessage name="Vitalik" />
      </CaptureProps>
    </FixtureProvider>
  );

  const [props1, props2] = instance.getInstance().state.fixtureState.props;
  expect(props1).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'HelloMessage'
    },
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
  expect(props2).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'HelloMessage'
    },
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Vitalik'
      }
    ]
  });
});

it('captures props from multiple instances (direct children)', () => {
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </FixtureProvider>
  );

  const [props1, props2] = instance.getInstance().state.fixtureState.props;
  expect(props1).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'HelloMessage'
    },
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
  expect(props2).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'HelloMessage'
    },
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Vitalik'
      }
    ]
  });
});

it('overwrites props in multiple instances', () => {
  const fixture = (
    <Fragment>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </Fragment>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [
    { component: component1 },
    { component: component2 }
  ] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          getPropsWithName({ name: 'SATOSHI', component: component1 }),
          getPropsWithName({ name: 'VITALIK', component: component2 })
        ]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toEqual(['Hello, SATOSHI!', 'Hello, VITALIK!']);
});

function getPropsWithName({
  component,
  name,
  renderKey = 0
}: {
  component: ComponentMetadata,
  name: string,
  renderKey?: number
}) {
  return {
    component,
    renderKey,
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}

function getEmptyProps({ component }) {
  return {
    component,
    renderKey: 0,
    values: []
  };
}
