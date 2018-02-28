import { ApolloLink, Observable } from 'apollo-link';

export function createFixtureLink({ apolloFixture, cache }) {
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
              ? resolveWith({ cache, variables })
              : resolveWith
        });

        observer.complete();
      })
  );
}
