import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {compose} from 'redux';

const Survey = compose(
  reduxForm({
    form: 'survey',
    onSubmit: (vals) => {

    }
  })
)(({handleSubmit}) => (
  <form onSubmit={handleSubmit}>
    <Field name='test' component='input'/>
  </form>
));

export default Survey;
