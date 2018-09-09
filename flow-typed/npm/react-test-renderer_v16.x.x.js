// flow-typed signature: 2c70223ccadf23513c28ebff4469aaa0
// flow-typed version: 8cdcc6637e/react-test-renderer_v16.x.x/flow_>=v0.47.x

// Type definitions for react-test-renderer 16.x.x
// Ported from: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-test-renderer

// https://github.com/flow-typed/flow-typed/pull/2715
type ReactComponentInstance = React$Component<any>;

type ReactTestRendererJSON = {
  type: string,
  props: { [propName: string]: any },
  children: null | ReactTestRendererJSON[]
};

type ReactTestRendererTree = ReactTestRendererJSON & {
  nodeType: 'component' | 'host',
  instance: ?ReactComponentInstance,
  rendered: null | ReactTestRendererTree
};

type ReactTestInstance = {
  instance: ?ReactComponentInstance,
  type: string,
  props: { [propName: string]: any },
  parent: null | ReactTestInstance,
  children: Array<ReactTestInstance | string>,

  find(predicate: (node: ReactTestInstance) => boolean): ReactTestInstance,
  findByType(type: React$ElementType): ReactTestInstance,
  findByProps(props: { [propName: string]: any }): ReactTestInstance,

  findAll(
    predicate: (node: ReactTestInstance) => boolean,
    options?: { deep: boolean }
  ): ReactTestInstance[],
  findAllByType(
    type: React$ElementType,
    options?: { deep: boolean }
  ): ReactTestInstance[],
  findAllByProps(
    props: { [propName: string]: any },
    options?: { deep: boolean }
  ): ReactTestInstance[]
};

type TestRendererOptions = {
  createNodeMock(element: React$Element<any>): any
};

declare module 'react-test-renderer' {
  declare export type ReactTestRenderer = {
    toJSON(): null | ReactTestRendererJSON,
    toTree(): null | ReactTestRendererTree,
    unmount(nextElement?: React$Element<any>): void,
    update(nextElement: React$Element<any>): void,
    getInstance(): ?ReactComponentInstance,
    root: ReactTestInstance
  };

  declare function create(
    nextElement: React$Element<any>,
    options?: TestRendererOptions
  ): ReactTestRenderer;
}

declare module 'react-test-renderer/shallow' {
  declare export default class ShallowRenderer {
    static createRenderer(): ShallowRenderer;
    getMountedInstance(): ReactTestInstance;
    getRenderOutput<E: React$Element<any>>(): E;
    getRenderOutput(): React$Element<any>;
    render(element: React$Element<any>, context?: any): void;
    unmount(): void;
  }
}
