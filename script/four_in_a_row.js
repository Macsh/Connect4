(function ( $ ) {

    $.fn.four_in_a_row = function(options) {
        let settings = $.extend({}, $.fn.four_in_a_row.defaults, options );

        ///////////// SETTING UP BOARD /////////////

        let newCanvas = $('<canvas/>',{'class':'backWhite'})
        .css({
            'background-color':'white',
            width: 52,
            height: 50,
            padding: 0,
            border: settings.border,
            'border-radius' : 100
        });

        for (let i=0; i<settings.columnY; i++) {
            let row = $('<tr/>',{'class':i+1});
            $(this).append(row);
            for (j=0; j<settings.columnX; j++) {
                let column = $('<td/>',{'class':j+1});
                $("tr."+(i+1)).append(column);
            }
        }

        $(this).css({
            backgroundColor: settings.backgroundColor,
            width: (50*settings.columnX)+"px",
            "line-height": 0,
            border: settings.border,
            margin: "auto",
            padding: 0,
        });
        $(this).find('*').css({
            border: settings.border,
            textAlign: "center",
            margin: "auto",
        });
        $('#score #p1turn').css({'background-color':settings.playerOneColor});

        $('.four-in-a-row td').each(function(){
            $('.four-in-a-row td').html(newCanvas);
        })

        ///////////// GAME FUNCTIONS /////////////

        let playerOneTurn = true;
        let numberOfTurn = 0;

        return this.each(function() {
            
            $('td').on('click', function(e){
                let column = $(this).attr('class');

                if (playerOneTurn != true){
                    $('#score #p1turn').css({'background-color':settings.playerOneColor});
                    $('#score #p2turn').css({'background-color':'white'});
                }
                else {
                    $('#score #p1turn').css({'background-color':'white'});
                    $('#score #p2turn').css({'background-color':settings.playerTwoColor});
                }

                for (let k=settings.columnY; k>0; k--) {
                    let row = $('tr.'+k);
                    let playerCanvas = $(row).children('.'+column).children()[0];
                    if($(playerCanvas).hasClass('backWhite') && playerOneTurn == true){
                        $(playerCanvas).attr('class', 'player1');
                        $(playerCanvas).css({'background-color': settings.playerOneColor, 'opacity':'1'});
                        playerOneTurn = false;
                        numberOfTurn++;
                        return false;
                    }
                    else if ($(playerCanvas).hasClass('backWhite') && playerOneTurn == false){
                        $(playerCanvas).attr('class', 'player2');
                        $(playerCanvas).css({'background-color': settings.playerTwoColor, 'opacity':'1'});
                        playerOneTurn = true;
                        return false;
                    }
                }
            });

            $('td').hover(function(e){
                let column = $(this).attr('class');

                for (let k=settings.columnY; k>0; k--) {
                    let row = $('tr.'+k);
                    let playerCanvas = $(row).children('.'+column).children()[0];
                    if($(playerCanvas).hasClass('backWhite') && playerOneTurn == true){
                        $(playerCanvas).css({'background-color': settings.playerOneColor, 'opacity':'0.85'});
                        return false;
                    }
                    else if ($(playerCanvas).hasClass('backWhite') && playerOneTurn == false){
                        $(playerCanvas).css({'background-color': settings.playerTwoColor, 'opacity':'0.85'});
                        return false;
                    }
                }
            }, function(){
                let column = $(this).attr('class');

                for (let k=settings.columnY; k>0; k--) {
                    let row = $('tr.'+k);
                    let playerCanvas = $(row).children('.'+column).children()[0];
                    if($(playerCanvas).hasClass('backWhite') && playerOneTurn == true){
                        $(playerCanvas).css({'background-color': 'white', 'opacity':'1'});
                        return false;
                    }
                    else if ($(playerCanvas).hasClass('backWhite') && playerOneTurn == false){
                        $(playerCanvas).css({'background-color': 'white', 'opacity':'1'});
                        return false;
                    }
                }
            });

            ///////////// GET PLAYERS POSITION FUNCTION /////////////

            let winningPos = [];
            for (let r=0; r<settings.columnY; r++) {
                winningPos[r+1] = [];
                for (let c=0; c<settings.columnX; c++){
                    winningPos[r+1].push(0);
                }
            }
            

            $('td').on('click', function(e){
                for (let l=settings.columnY; l>0; l--) {
                    for (m=0; m<settings.columnX; m++) {
                        let row = $('tr.'+l);
                        let column = $('td.'+(m+1));
                        $(row).children(column).children('.player1').each( function(){
                            let player1 = $(this);
                            let player1Row = $(player1).closest('tr').attr('class');
                            let player1Col = $(player1).parent().attr('class');

                            if (!isNaN(player1Row+player1Col)) {
                                if(winningPos[player1Row][player1Col-1] > 0){
                                }
                                else {
                                    winningPos[player1Row][player1Col-1] = 1;
                                }
                            }
                        });
                        $(row).children(column).children('.player2').each( function(){
                            let player2 = $(this);
                            let player2Row = $(player2).closest('tr').attr('class');
                            let player2Col = $(player2).parent().attr('class');
                        
                            if (!isNaN(player2Row+player2Col)) {
                                if(winningPos[player2Row][player2Col-1] > 0){
                                }
                                else {
                                    winningPos[player2Row][player2Col-1] = 2;
                                }
                            }
                        });
                    }
                }
            });

            ///////////// CHECK VICTORY CONDITIONS /////////////

            let player1Victory = 0;
            let player2Victory = 0;
            let playerCheck;

            function checkVictory(){
                if (playerCheck == 1){
                    player1Victory ++;
                    setTimeout(
                        function(){
                            let win = confirm("Player 1 Wins!\nWould you like to start a new game?");
                        
                            if(win){
                                $('#displayscore').show();
                                $('#p1score').html(player1Victory);
                                $('#p2score').html(player2Victory);
                                $('canvas').each(function(){
                                    $(this).attr('class', 'backWhite');
                                    $(this).css({'background-color' : 'white'})
                                })
                                winningPos = [];
                                for (let r=0; r<settings.columnY; r++) {
                                    winningPos[r+1] = [];
                                    for (let c=0; c<settings.columnX; c++){
                                        winningPos[r+1].push(0);
                                    }
                                }
                                $('#score #p1turn').css({'background-color':settings.playerOneColor});
                                $('#score #p2turn').css({'background-color':'white'});
                                playerOneTurn = true;
                            }
                            else {
                                $('td').unbind('hover');
                                $('td').unbind('click');
                            }
                    }, 100);
                }
                else {
                    player2Victory ++;
                    setTimeout(
                        function(){
                            let win = confirm("Player 2 Wins!\nWould you like to start a new game?");
                        
                            if(win){
                                $('#displayscore').show();
                                $('#p1score').html(player1Victory);
                                $('#p2score').html(player2Victory);
                                $('canvas').each(function(){
                                    $(this).attr('class', 'backWhite');
                                    $(this).css({'background-color' : 'white'})
                                })
                                winningPos = [];
                                for (let r=0; r<settings.columnY; r++) {
                                    winningPos[r+1] = [];
                                    for (let c=0; c<settings.columnX; c++){
                                        winningPos[r+1].push(0);
                                    }
                                }
                                $('#score #p1turn').css({'background-color':settings.playerOneColor});
                                $('#score #p2turn').css({'background-color':'white'});
                                playerOneTurn = true;
                            }
                            else {
                                $('td').unbind('hover');
                                $('td').unbind('click');
                            }
                    }, 100);
                }
            }

            $('td').on('click', function(e){
                if(numberOfTurn >= 4) {

                    ///////////// VERTICAL /////////////
                    
                    for (let r=(settings.columnY-3); r>0; r--) {
                        for (c=0; c<settings.columnX; c++) {
                            if(winningPos[r][c] != 0 && winningPos[r][c] == winningPos[r+1][c] && winningPos[r][c] == winningPos[r+2][c] && winningPos[r][c] == winningPos[r+3][c]){
                                playerCheck = winningPos[r][c];
                                return checkVictory();
                            }
                        }
                    }

                    ///////////// HORIZONTAL /////////////

                    for (let r=settings.columnY ; r>0 ; r--){
                        for (c=0 ; c<(settings.columnX-3) ; c++){
                            if(winningPos[r][c] != 0 && winningPos[r][c] == winningPos[r][c+1] && winningPos[r][c] == winningPos[r][c+2] && winningPos[r][c] == winningPos[r][c+3]){
                                playerCheck = winningPos[r][c];
                                return checkVictory();
                            }
                        }
                    }

                    ///////////// DIAGONAL RIGHT AND DOWN /////////////

                    for (let r=1; r<(settings.columnY-2) ; r++){
                        for (let c=0 ; c<(settings.columnX-3); c++){
                            if(winningPos[r][c] != 0 && winningPos[r][c] == winningPos[r+1][c+1] && winningPos[r][c] == winningPos[r+2][c+2] && winningPos[r][c] == winningPos[r+3][c+3]){
                                playerCheck = winningPos[r][c];
                                return checkVictory();
                            }
                        }
                    }

                    ///////////// DIAGONAL RIGHT AND UP /////////////

                    for (let r=settings.columnY; r>(settings.columnY-3) ; r--){
                        for (let c=0 ; c<(settings.columnX-3); c++){
                            if(winningPos[r][c] != 0 && winningPos[r][c] == winningPos[r-1][c+1] && winningPos[r][c] == winningPos[r-2][c+2] && winningPos[r][c] == winningPos[r-3][c+3]){
                                playerCheck = winningPos[r][c];
                                return checkVictory();
                            }
                        }
                    }

                    let nbOfWhite = 0;

                    $('canvas').each(function(){
                        if ($(this).hasClass("backWhite")) {
                            nbOfWhite++;
                        }
                    })
                    if (nbOfWhite == 0){
                        let draw = confirm("It's a draw!\nWould you like to start a new game?");
                        
                            if(draw){
                                $('#p1score').html(player1Victory);
                                $('#p2score').html(player2Victory);
                                $('canvas').each(function(){
                                    $(this).attr('class', 'backWhite');
                                    $(this).css({'background-color' : 'white'})
                                })
                                winningPos = [];
                                for (let r=0; r<settings.columnY; r++) {
                                    winningPos[r+1] = [];
                                    for (let c=0; c<settings.columnX; c++){
                                        winningPos[r+1].push(0);
                                    }
                                }
                                playerOneTurn = true;
                            }
                            else {
                                location.reload();
                            }
                    }
                    else {
                        nbOfWhite = 0;
                    }
                }
            });
            
        });
    }

    $.fn.four_in_a_row.defaults = {
        playerOneColor: "yellow",
        playerTwoColor: "red",
        columnX: "7",
        columnY: "6",
        border: "black 2px solid",
        backgroundColor: "blue",
    };

}(jQuery));