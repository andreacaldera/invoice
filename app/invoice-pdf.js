var fs = require('fs');
var pdf = require('html-pdf');
var _ = require('underscore');

var html = fs.readFileSync('./template/invoice-template.html', 'utf8');

$ = require('cheerio').load(html);
var invoiceRow = ($('tr[class=invoice-row]').html());

var pdfOptions = {format: 'A4'};

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

    create: function (config, items, callback) {
        pdf.create(fill(html, config, items), pdfOptions).toBuffer(callback);
    }

};