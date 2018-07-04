import { ApolloLink, Observable } from 'apollo-link';

export function createFixtureLink({ apolloFixture, cache, fixture }) {
  return new ApolloLink(
    ({ operationName, variables }) =>
      new Observable(observer => {
        const { failWith, resolveWith } =
          apolloFixture[operationName] || apolloFixture;

        if (failWith) {
          observer.error(failWith);
        }

        observer.next({
          data:
            typeof resolveWith === 'function'
              ? resolveWith({ cache, variables, fixture })
              : resolveWith.data
                ? resolveWith.data
                : resolveWith,
          errors:
            (typeof resolveWith !== 'function' && resolveWith.errors) ||
            undefined
        });

        observer.complete();
      })
  );
}
