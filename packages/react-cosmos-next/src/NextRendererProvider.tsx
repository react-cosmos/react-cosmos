'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
  RendererConfig,
  StringRendererSearchParams,
  buildQueryString,
} from 'react-cosmos-core';
import { DomRendererProvider } from 'react-cosmos-dom';

export function NextRendererProvider({
  children,
  rendererConfig,
  searchParams,
}: {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  searchParams: StringRendererSearchParams;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = React.useCallback(
    (nextParams: StringRendererSearchParams) => {
      router.push(pathname + buildQueryString(nextParams));
    },
    [pathname, router]
  );

  return (
    <DomRendererProvider
      rendererConfig={rendererConfig}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    >
      {children}
    </DomRendererProvider>
  );
}
