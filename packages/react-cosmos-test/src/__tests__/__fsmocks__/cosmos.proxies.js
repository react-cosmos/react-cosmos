export function ProxyFoo(props) {
  const { nextProxy } = props;
  return <nextProxy.value {...props} nextProxy={nextProxy.next()} />;
}

export function ProxyBar(props) {
  const { nextProxy } = props;
  return <nextProxy.value {...props} nextProxy={nextProxy.next()} />;
}

export default [ProxyFoo, ProxyBar];
