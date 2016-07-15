function Script3() {
    console.log("loaded Script3");
    allow["Script3"] = false;
    $('.sqz').hover(function () {
        $(this).animateCss('pulse');
    });

    socket.emit('newmatch', {});


    function onMatchStart(data) {
        var letter;
        var othername = data.username;
        $('#gameinfo').html(username + " vs " + data.username);
        var isUrTurn = data.firstmove == username ? true : false;

        if (!isUrTurn) {
            Print(data.username + " Accepted your challenge", "success");
            letter = "O";
            notYourTurn(data.username);
        } else {
            Print("You Accepted the challenge from " + data.username, "success");
            letter = "X";
            yourTurn(letter, othername);
        }
        waitForMoves(letter, othername);
    }

    function waitForMoves(letter, othername) {
        socket.removeAllListeners("newmovemade");
        socket.on('newmovemade', function (data) {
            drawOnCanvas($('#drawCanvas' + data.boxnum), data.letter);
            if (checkwin()) {
                Print("You Lost", "error");
                $('#status').html("<h1>" + othername + " Won</h1>");
                endMatch("lost");
                return;
            }
            yourTurn(letter, othername);
        });
    }

    function onOpponentLeft(data) {
        $('#status').html("<h1>" + data.username + " Left the Match - <span id=\"back\">Go Back</span></h1>");
        $('#back').unbind('click');
        $('#back').click(function () {
            allow["Script2"] = true;
            ViewPage("Challenge",Script2);
        });
    }


    function notYourTurn(othername) {
        $('.sqz').unbind("click");
        $('.sqz').click(function () {
            $(this).animateCss('rubberBand');
        });
        $('#status').html("<h1>" + othername + "'s Turn</h1>");
    }

    function yourTurn(letter, othername) {
        $('#status').html("<h1>" + username + "'s Turn</h1>");
        $('.sqz').unbind("click");
        $('.sqz').click(function () {
            if (!drawOnCanvas($(this), letter))
                return;
            socket.emit('newmove', {
                boxnum: $(this).attr("num")
            });
            if (checkwin()) {
                Print("You Won", "success");
                $('#status').html("<h1>" + username + " Won</h1>");
                endMatch("won");
                return;
            }
            notYourTurn(othername);
        });
    }

    function drawOnCanvas(c, letter) {
        if (c.attr('filled') == "1") {
            Print("Error", "Invalid Move", "Try Again", "error");
            return false;
        }

        c.animateCss("rubberBand");
        var ctx = c[0].getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "80px Arial";
        ctx.fillText(letter, 21, 77);
        c.attr("filled", "1");
        c.attr("with", letter);
        return true;
    }

    function checkwin() {
        var boxs = [];
        boxs.push({});
        $.each($('.sqz'), function (index, value) {
            boxs.push({
                isX: value.getAttribute("with") == "X" ? true : false,
                isO: value.getAttribute("with") == "O" ? true : false,
                animate: function () {
                    $('#' + value.id).animateCss('tada');
                }
            });
        });

        var p = [];
        p.push(
        [1, 2, 3], [3, 6, 9], [9, 8, 7], [7, 4, 1], [1, 5, 9], [3, 5, 7], [4, 5, 6], [7, 8, 9], [2, 5, 8]
        );
        for (var i = 0; i < p.length; i++)
            if ((boxs[p[i][0]].isX && boxs[p[i][1]].isX && boxs[p[i][2]].isX) || (boxs[p[i][0]].isO && boxs[p[i][1]].isO && boxs[p[i][2]].isO)) {
                boxs[p[i][0]].animate();
                boxs[p[i][1]].animate();
                boxs[p[i][2]].animate();
                return true;
            }
        if (checkForTie()) {
            Print('Match Tied', "info");
            endMatch("tied");
        }
    }

    function checkForTie() {
        var toreturn = true;
        $.each($('.sqz'), function (index, value) {
            if ($('#' + value.id).attr('filled') == 0) {
                toreturn = false;
                return false;
            }
        });
        return toreturn;
    }

    function endMatch(res) {
        socket.emit('endmatch', {
            stat: res
        });
        setTimeout(function () {
            allow["Script2"] = true;
            ViewPage("Challenge",Script2);
        }, 2000);
    }

    socketListen('matchstartinfox', onMatchStart);
    socketListen('opponentleft', onOpponentLeft);
    socketListen('newmovemade', onOpponentLeft);
}
