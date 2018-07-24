import { ApolloLink, Observable } from 'apollo-link';

function resolveFunctionOrPromise(result, observer) {
  // test to see if the result "looks" like a promise
  if (typeof result.then === 'function' && typeof result.catch === 'function') {
    result
      .then(data => {
        observer.next({
          data
        });
      })
      .catch(errors => {
        observer.next({
          errors
        });
      })
      .then(() => {
        observer.complete();
      });
  } else {
    observer.next({
      data: result
    });
    observer.complete();
  }
}

export function createFixtureLink({ apolloFixture, cache, fixture }) {
  return new ApolloLink(
    ({ operationName, variables, ...others }) =>
      new Observable(observer => {
        const { failWith, resolveWith } =
          apolloFixture[operationName] || apolloFixture;

        if (failWith) {
          observer.error(failWith);
        }

        if (typeof resolveWith === 'function') {
          resolveFunctionOrPromise(
            resolveWith({
              cache,
              variables,
              fixture,
              operationName,
              ...others
            }),
            observer
          );
        } else {
          observer.next({
            data: resolveWith.data ? resolveWith.data : resolveWith,
            errors: resolveWith.errors
          });

          observer.complete();
        }
      })
  );
}
