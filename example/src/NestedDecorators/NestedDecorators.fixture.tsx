import React from 'react';
import { Fixture } from './Fixture';
import { Input } from './NestedDecorators';

export default (
  <Fixture
    formik
    formikValues={{ foo: true }}
    intl
    intlValues={{ bar: false }}
    layout="wide"
  >
    <Input name="name" label="Your Name" />
  </Fixture>
);
