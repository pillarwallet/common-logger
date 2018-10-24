/**
 * @description Serializes the HttpResponse and returns only relevant properties
 *
 * @param req
 * @param res
 * @param time
 * @returns {{method: *, url: *, responseTime: string, statusCode: *|number}}
 */
module.exports = (req, res, time) => ({
  method: req.method,
  url: req.url,
  responseTime: `${time.toString()} sec`,
  statusCode: res.statusCode,
});
