$('form').on('submit', function(e){
    e.preventDefault();
    let nbRow = $('#row-select option:selected').val();
    let nbCol = $('#col-select option:selected').val();
    let p1Color = $('#p1-select option:selected').val();
    let p2Color = $('#p2-select option:selected').val();
    let boardColor = $('#board-select option:selected').val();

    $('form').remove();

    $(".four-in-a-row").four_in_a_row({columnX : nbCol, columnY : nbRow, playerOneColor : p1Color, playerTwoColor : p2Color, backgroundColor : boardColor});
});