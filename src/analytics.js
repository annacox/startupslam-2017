// Load up some polyfills for older browsers.
import 'navigator.sendbeacon';
import 'whatwg-fetch';

import {hri} from 'human-readable-ids';

if (!localStorage.getItem('defaultIndex')) {
  localStorage.setItem('defaultIndex', hri.random());
}

export const indexName = localStorage.getItem('defaultIndex');

/**
 * If you have ElasticSearch setup elsewhere you can change
 * this URL to point to your own instance.
 */
export const baseUrl = [
  'https://',
  'search-startupslam-4zqyzoae7nleoc6wbdiscros34.',
  'us-west-2.es.amazonaws.com',
  `/${indexName}`,
].join('');

// Generate a random, persistent visitor id.
if (!localStorage.getItem('slamid')) {
  localStorage.setItem('slamid', Math.random().toString(36).substr(2));
}

const slamId = localStorage.getItem('slamid');

/**
 * Send an analytics event to ElasticSearch. Normally this
 * would be implemented on your server somewhere.
 * @param {String} type Type of event.
 * @param {Object} payload Data for the event.
 * @returns {void}
 */
export const sendEvent = (type, payload) => {
  const body = JSON.stringify(Object.assign({
    '@timestamp': Date.now(),
    slamId,
  }, payload));
  // NOTE: We should be using a Blob with the correct
  // `type` but Chrome doesn't like it and ElasticSearch
  // is fine with this... soooo....
  navigator.sendBeacon(`${baseUrl}/${type}`, body);
};

/**
 * Deal with a fetch response.
 * @param {Object} res Fetch response.
 * @returns {Promise} JSON data from the fetch.
 */
const handleResponse = (res) => {
  const body = res.json();
  if (res.ok) {
    return body;
  }
  return Promise.reject(body);
};

/**
 * Setup the ElasticSearch index.
 * @returns {void}
 */
export const setupIndex = () => {
  fetch(baseUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      mappings: {
        pageview: {
          properties: {
            '@timestamp': {type: 'date'},
          },
        },
      },
    }),
  }).then(handleResponse);
};

/**
 * Tear down the ElasticSearch index.
 *
 * @returns {void}
 */
export const removeIndex = () => {
  fetch(baseUrl, {
    method: 'DELETE',
    accept: 'application/json',
  }).then(handleResponse);
};
