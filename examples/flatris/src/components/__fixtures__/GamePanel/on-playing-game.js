
import { PLAYING } from '../../../constants/states';

export default {
  gameState: PLAYING,
  score: 10,
  lines: 0,
  nextTetrimino: 'S',
  onStart: () => console.log('Start'),
  onPause: () => console.log('Pause'),
  onResume: () => console.log('Resume'),
};
