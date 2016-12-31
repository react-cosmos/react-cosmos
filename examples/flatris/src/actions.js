import raf from 'raf';

import { STOPPED, PLAYING } from './constants/states';
import {
  DROP_FRAMES_ACCELERATED,
} from './constants/grid';

const FPS = 60;
const frameDuration = 1000 / FPS;

let animationHandle;
let timeBegin;

const cancelFrame = () => {
  raf.cancel(animationHandle);
};

const scheduleFrame = (cb) => {
  timeBegin = Date.now();
  animationHandle = raf(() => {
    const timeEnd = Date.now();
    cb((timeEnd - timeBegin) / frameDuration);
  });
};

// This changes too fast (60fps) to keep it in the store's state
let yProgress = 0;
export const advance = () => (dispatch, getState) => {
  cancelFrame();
  scheduleFrame((frames) => {
    const {
      gameState,
      dropAcceleration,
      dropFrames,
    } = getState();

    // Stop animation when game ended
    if (gameState === STOPPED) {
      return;
    }

    const framesPerDrop = (dropAcceleration ? DROP_FRAMES_ACCELERATED : dropFrames);

    yProgress += frames / framesPerDrop;
    if (yProgress > 1) {
      dispatch({
        type: 'ADVANCE',
        payload: { rows: Math.floor(yProgress) },
      });
      yProgress %= 1;
    }

    dispatch(advance());
  });
};

export const load = () => (dispatch, getState) => {
  // Game can be initialized in a playing state
  if (getState().gameState === PLAYING) {
    dispatch(advance());
  }
};

export const start = () => (dispatch) => {
  dispatch({ type: 'START' });
  dispatch(advance());
};

export const pause = () => (dispatch) => {
  dispatch({ type: 'PAUSE' });
  cancelFrame();
};

export const resume = () => (dispatch) => {
  dispatch({ type: 'RESUME' });
  dispatch(advance());
};

export const moveLeft = () => ({
  type: 'MOVE',
  payload: { direction: -1 },
});

export const moveRight = () => ({
  type: 'MOVE',
  payload: { direction: 1 },
});

export const rotate = () => ({
  type: 'ROTATE',
});

export const enableAcceleration = () => ({
  type: 'ENABLE_ACCELERATION',
});

export const disableAcceleration = () => ({
  type: 'DISABLE_ACCELERATION',
});
