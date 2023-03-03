declare module 'react-error-overlay' {
  export type ErrorLocation = {
    fileName: string;
    lineNumber?: number;
    colNumber?: number;
  };

  export function startReportingRuntimeErrors({ filename: string });
  export function reportBuildError(obj: {});
  export function setEditorHandler(
    cb: (errorLocation: ErrorLocation) => unknown
  );
  export function dismissRuntimeErrors();
  export function dismissBuildError();
}
