const { httpGet } = require('./mock-http-interface');

const SUCCESS_KEY = 'Arnie Quote';
const FAILURE_KEY = 'FAILURE';
const HTTP_STATUS_OK = 200;

/**
 * @param {HttpGetResponse} response
 * @returns {ArnieQuoteResult}
 */
const mapResponseToResult = ({ status, body }) => {
  const { message } = JSON.parse(body);

  if (status === HTTP_STATUS_OK) {
    return { [SUCCESS_KEY]: message };
  }

  return { [FAILURE_KEY]: message };
};

/**
 * @param {GetArnieQuotesInput} urls
 * @returns {ArnieQuoteResponse}
 */
const getArnieQuotes = async (urls) => {
  return Promise.all(
    urls.map(async (url) => mapResponseToResult(await httpGet(url))),
  );
};

module.exports = {
  getArnieQuotes,
};
