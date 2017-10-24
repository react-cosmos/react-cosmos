import DragHandle from '../index';

export default {
  component: DragHandle,

  props: {
    onDrag: value => console.log(value)
  }
};
