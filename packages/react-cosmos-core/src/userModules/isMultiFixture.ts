import { isValidElement } from 'react';
import { ReactFixtureExport, ReactFixtureMap } from './userModuleTypes.js';

export function isMultiFixture(
  fixtureExport: ReactFixtureExport
): fixtureExport is ReactFixtureMap {
  return (
    fixtureExport !== null &&
    typeof fixtureExport === 'object' &&
    !isValidElement(fixtureExport) &&
    // With React Server Components, fixture exports of Client fixtures are
    // wrapped in a Promise. The React ComponentType union does include
    // PromiseLikeOfReactNode but for some reason it's impossible do type
    // narrowing or use a type predicate function.
    // @ts-ignore Sadly, we resort to the "cause I said so" type assertion
    typeof fixtureExport.then !== 'function'
  );
}
