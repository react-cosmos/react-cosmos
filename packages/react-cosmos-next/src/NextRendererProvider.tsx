'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
  RendererConfig,
  RendererSearchParams,
  buildQueryString,
} from 'react-cosmos-core';
import { DomRendererProvider } from 'react-cosmos-dom';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  searchParams: RendererSearchParams;
};
export function NextRendererProvider({
  children,
  rendererConfig,
  searchParams,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = React.useCallback(
    (nextParams: RendererSearchParams) => {
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
