/**
 * Handle response from JSON-based API via `fetch`.
 * Basically just rejects promises that fail an
 * HTTP status code check and parses JSON bodies.
 * @param {Response} res Fetch response.
 * @returns {Promise} JSON parsed result of fetch.
 */
export const handleResponse = (res) => {
  const body = res.json();
  if (res.ok) {
    return body;
  }
  return body.then((x) => Promise.reject(x));
};

/**
 * Get the index name from an ElasticSearch URL.
 * @param {String} base The base ElasticSearch URL.
 * @returns {String} The index name.
 */
export const getIndex = (base) => {
  return /\/\/[^\/]+\/([^\/]+)/.exec(base)[1];
};
