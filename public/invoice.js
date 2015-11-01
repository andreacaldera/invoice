$('.add-invoice-item').click(function () {
    var newItem = $('.invoice-item-row').clone();
    newItem.append('<div class="col-sm-1"><span class="remove-invoice-item glyphicon glyphicon-minus red" aria-hidden="true"></span></div>');
    $('.add-invoice-item-block').before(newItem[0].outerHTML);
});

$('.remove-invoice-item').click(function (event) {
    $(event.target).parent().parent().remove();
});