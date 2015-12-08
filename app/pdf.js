var wkhtmltopdf = require('wkhtmltopdf')
var request = require('request')

module.exports = {

    create: function (req, res) {
        // TODO replace localhost:8080 with incoming hostname and port?
        var j = request.jar()
        var sessionCookie = request.cookie('connect.sid=' + req.cookies['connect.sid'])
        j.setCookie(sessionCookie, 'http://localhost:8080')
        request.defaults({jar: j})
            .get('http://localhost:8080/preview/' + req.params.invoiceId, function (error, response, body) {
                wkhtmltopdf(body).pipe(res)
            })
    }

}