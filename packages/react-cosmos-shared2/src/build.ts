export type BuildStartMessage = {
  type: 'buildStart';
};

export type BuildErrorMessage = {
  type: 'buildError';
};

export type BuildDoneMessage = {
  type: 'buildDone';
};

export type BuildMessage =
  | BuildStartMessage
  | BuildErrorMessage
  | BuildDoneMessage;

export const BUILD_MESSAGE_EVENT_NAME = 'cosmos-build-message';
