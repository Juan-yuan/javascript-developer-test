const { httpGet } = require('./mock-http-interface');

const SUCCESS_KEY = 'Arnie Quote';
const FAILURE_KEY = 'FAILURE';
const HTTP_STATUS_OK = 200;
const BODY_MESSAGE_KEY = 'message';
const INVALID_RESPONSE_BODY = 'Invalid response body';
const UNEXPECTED_ERROR = 'Unexpected error';

/**
 * @param {string} message
 * @returns {ArnieQuoteSuccess}
 */
const toSuccess = (message) => ({ [SUCCESS_KEY]: message });

/**
 * @param {string} message
 * @returns {ArnieQuoteFailure}
 */
const toFailure = (message) => ({ [FAILURE_KEY]: message });

/**
 * @param {unknown} error
 * @returns {ArnieQuoteFailure}
 */
const toFailureFromError = (error) => {
  const message = error instanceof Error ? error.message : UNEXPECTED_ERROR;
  return toFailure(message);
};

/**
 * @param {string} body
 * @returns {string|null}
 */
const extractMessage = (body) => {
  try {
    const parsed = JSON.parse(body);
    return typeof parsed?.[BODY_MESSAGE_KEY] === 'string' ? parsed[BODY_MESSAGE_KEY] : null;
  } catch {
    return null;
  }
};

/**
 * @param {HttpGetResponse} response
 * @returns {ArnieQuoteResult}
 */
const mapResponseToResult = ({ status, body }) => {
  const message = extractMessage(body);

  if (message === null) {
    return toFailure(INVALID_RESPONSE_BODY);
  }

  return status === HTTP_STATUS_OK ? toSuccess(message) : toFailure(message);
};

/**
 * @param {UrlString} url
 * @returns {Promise<ArnieQuoteResult>}
 */
const fetchQuoteForUrl = async (url) => {
  try {
    const response = await httpGet(url);
    return mapResponseToResult(response);
  } catch (error) {
    return toFailureFromError(error);
  }
};

/**
 * @param {GetArnieQuotesInput} urls
 * @returns {ArnieQuoteResponse}
 */
const getArnieQuotes = async (urls) => {
  return Promise.all(urls.map(fetchQuoteForUrl));
};

module.exports = {
  getArnieQuotes,
};
