import DragHandle from '../index';

export default {
  component: DragHandle,

  props: {
    vertical: true,
    onDrag: value => console.log(value)
  }
};
