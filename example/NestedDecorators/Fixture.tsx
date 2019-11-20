import React from 'react';

type FixtureProps = {
  children: React.ReactNode;
  intl: boolean;
  intlValues: {};
  formik: boolean;
  formikValues: {};
  layout: 'wide' | 'tall';
};

export function Fixture({
  children,
  intl,
  intlValues,
  formik,
  formikValues,
  layout
}: FixtureProps) {
  let newChildren = children;

  if (intl) {
    newChildren = (
      <IntlProvider values={intlValues}>{newChildren}</IntlProvider>
    );
  }

  if (formik) {
    newChildren = (
      <FormikProvider values={formikValues}>{newChildren}</FormikProvider>
    );
  }

  return (
    <span>
      (layout:{layout} {newChildren})
    </span>
  );
}

type ProviderProps = { children: React.ReactNode; values: {} };

function IntlProvider({ children }: ProviderProps) {
  return <span>(Intl {children})</span>;
}

function FormikProvider({ children }: ProviderProps) {
  return <span>(Formik {children})</span>;
}
