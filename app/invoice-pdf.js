var fs = require('fs')
var _ = require('underscore')
var wkhtmltopdf = require('wkhtmltopdf')
var request = require('request')
var streamToBuffer = require('stream-to-buffer')

var html = fs.readFileSync('./template/invoice-template.html', 'utf8');

$ = require('cheerio').load(html);
var invoiceRow = ($('tr[class=invoice-row]').html());


function invoiceRows(items) {
    var invoiceRowsHtml = '';
    _(items.length).times(function (i) {
        var invoiceItem = '<tr class="invoice-row">' + invoiceRow + '</tr>';
        invoiceRowsHtml += (invoiceItem
            .replace('__description__', items[i].description)
            .replace('__dailyRate__', items[i].dailyRate)
            .replace('__numberOfDays__', items[i].numberOfDays)
            .replace('__total__', (items[i].dailyRate * items[i].numberOfDays)));
    });
    return invoiceRowsHtml;
}

function fill(html, config, items) {
    var result = html;
    _.forEach(config, function (c) {
        result = result.replace(new RegExp('__' + c.placeholder + '__', 'g'), c.value);
    });
    return result.replace(invoiceRow, invoiceRows(items));
}

module.exports = {

    create: function (req, res) {
        console.log('1')
        var j = request.jar()
        var sessionCookie = request.cookie('connect.sid=' + req.cookies['connect.sid'])
        j.setCookie(sessionCookie, 'http://localhost:8080')
        request.defaults({jar: j})
            .get('http://localhost:8080/preview/' + req.params.invoiceId, function (error, response, body) {
                wkhtmltopdf(body).pipe(res)
            })
    }

};