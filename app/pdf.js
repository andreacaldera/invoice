const wkhtmltopdf = require('wkhtmltopdf');
const request = require('request');
const log = require('./log');
const serverConfig = require('./config/server');

module.exports = {
  create(req, res) {
    const j = request.jar();
    const sessionCookie = request.cookie(`connect.sid=${req.cookies['connect.sid']}`);
    const baseUrl = `${req.protocol}://${req.hostname}:${serverConfig.port}`;
    j.setCookie(sessionCookie, baseUrl);
    const url = `${baseUrl}/preview/${req.params.invoiceId}?download`;
    log.debug(`Generating PDF from URL ${url}`);
    request.defaults({ jar: j })
            .get(url, (error, response, body) => {
              wkhtmltopdf(body).pipe(res);
            });
  },
};
