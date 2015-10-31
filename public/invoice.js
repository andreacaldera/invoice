$('button.add-invoice-item').click(function() {
    $($('.invoice-item-row')[0]).after($('.invoice-item-row')[0].outerHTML);
});