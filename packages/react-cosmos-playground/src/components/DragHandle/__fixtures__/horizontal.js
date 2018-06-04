import DragHandle from '..';

export default {
  component: DragHandle,

  props: {
    onDrag: value => console.log(value)
  }
};
