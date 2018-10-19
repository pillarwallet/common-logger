/**
 * Simple string parser
 *
 * @param string
 * @param begin
 * @param end
 * @returns {string}
 */
const httpHeaderParser = (string, begin, end) =>
  string
    .substring(string.indexOf(begin) + begin.length, string.indexOf(end))
    .trim();

/**
 *
 * @param req
 * @param res
 * @returns {{method: *, url: *, responseTime: string, statusCode: *|number}}
 */
module.exports = (req, res) => ({
  method: req.method,
  url: req.url,
  responseTime: httpHeaderParser(res._header, 'X-Response-Time:', '\r\nDate:'), // eslint-disable-line
  statusCode: res.statusCode,
});
