declare module 'react-element-to-jsx-string' {
  import React from 'react';

  export default function reactElementToJSXString(
    element: React.ReactElement
  ): string;

  export = reactElementToJSXString;
}
