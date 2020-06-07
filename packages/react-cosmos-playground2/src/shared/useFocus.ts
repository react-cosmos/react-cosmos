import React from 'react';

export function useFocus() {
  const [focused, setFocused] = React.useState(false);
  const onFocus = React.useCallback(() => setFocused(true), []);
  const onBlur = React.useCallback(() => setFocused(false), []);
  return { focused, onFocus, onBlur };
}
