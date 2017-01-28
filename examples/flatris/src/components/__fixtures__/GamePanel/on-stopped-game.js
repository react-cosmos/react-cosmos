import { STOPPED } from '../../../constants/states';

export default {
  gameState: STOPPED,
  score: 0,
  lines: 0,
  nextTetrimino: null,
  onStart: () => console.log('Start'),
  onPause: () => console.log('Pause'),
  onResume: () => console.log('Resume'),
};
