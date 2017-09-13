import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {reducer as form} from 'redux-form';
import {createStore, combineReducers} from 'redux';

import pageView from './event/pageView';
import pageLeave from './event/pageLeave';

import Form from './Survey';
import Setup from './Setup';

import {indexName} from './analytics';

const reducer = combineReducers({
  form,
});

const store = createStore(reducer);

const app = (
  <Provider store={store}>
    <div>
      {indexName}
      <Form/>
      <Setup/>
    </div>
  </Provider>
);

render(app, document.querySelector('#app'));

pageView();

window.onbeforeunload = () => {
  pageLeave();
};
