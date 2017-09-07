import React from 'react';
import Node from '../index';

import { data as file } from './file';

export const data = {
  open: true,
  name: 'happy',
  path: 'happy'
};

export default {
  props: data,
  children: <Node {...file} />
};
