import React from 'react';

import {setupIndex, removeIndex} from './analytics';

const Setup = () => (
  <div>
    <button onClick={() => setupIndex()}>
      Setup Index
    </button>
    <button onClick={() => removeIndex()}>
      Remove Index
    </button>
  </div>
);

export default Setup;
