// From https://gist.github.com/WaldoJeffers/905e14d03f4283599bac753f73b7716b
export function compose(...fns: Array<(...args: any[]) => any>) {
  return fns.reduce((f, g) => (...args) => f(g(...args)));
}
