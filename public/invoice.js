$('.add-invoice-item').click(function () {
    var newItem = $('.invoice-item-row').clone();
    newItem.find('.remove-invoice-item-block').css('display', 'inline-block');
    $('.add-invoice-item-block').before(newItem[0].outerHTML);

    $('.remove-invoice-item').click(function (event) {
        $(event.target).parents('.invoice-item-row').remove();
    });
});