import Author from '../../Author';

export default {
  component: Author,

  props: {
    authorId: 'foobar'
  },
  apollo: {
    failWith: {
      message: 'meh! error message'
    }
  }
};
