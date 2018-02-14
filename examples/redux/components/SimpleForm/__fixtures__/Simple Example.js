import SimpleForm from '../SimpleForm';

const showResults = values => {
  console.log(
    'SimpleForm:',
    `You submitted:\n\n${JSON.stringify(values, null, 2)}`
  );
};

export default {
  component: SimpleForm,
  props: {
    onSubmit: showResults
  },
  reduxState: {}
};
