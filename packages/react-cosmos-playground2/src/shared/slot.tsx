import * as React from 'react';

type Children = { children?: React.ReactNode };

export type ExcludeChildren<Props> = Pick<
  Props,
  Exclude<keyof Props, 'children'>
>;

export type PlugProps<ComponentProps> = ComponentProps & Children;
