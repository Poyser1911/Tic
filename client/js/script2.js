function Script2() {
    console.log("loaded Script2");
    allow["Script2"] = false;
    $('.welcome').html("Welcome " + username);

    socket.emit('getusersonline', {});
    
    $('.chatbox input').keydown(function (event) {
        if (event.which == "13") {
            d = new Date();
            var t = d.toLocaleTimeString();
            if ($(this).val().trim() != '')
                socket.emit('chatmessage', {
                    message: $(this).val(),
                    time: "[" + t + "]"
                });
            $(this).val("");
        }
    });


    function onUsersOnline(data) {
        var list = "";
        for (var i = 0; i < data.length; i++) {
            if (username != data[i].name) list += "<li uid=" + data[i].id + ">" + data[i].name + "</li>";
            else {
                list += "<li uid=" + data[i].id + "><font color=\"yellow\">" + data[i].name + "</font></li>";
            }
        }
        $('#usersonline').html('Users Online: ' + data.length);
        $('.onlinelist').html(list);

        $('ul.onlinelist li').click(function () {
            if (username == $(this).text())
                Print("Can not challenge yourself", "error");
            else {
                socket.emit('newchallange', {
                    to: $(this).attr('uid'),
                    time: (new Date).toString()
                });
            }
        });
    }

    function onReq(data) {
        alertify.parent($('body')[0]);
        var response = {
            time: (new Date).toString()
        }
        alertify.confirm("<font color=\"#000000\">New Challenge Requested From " + data.username + "</font>", function () {
            socket.emit('challangestart', response);
            allow["Script3"] = true;
            ViewPage("Play",Script3);
        }, function () {
            socket.emit('challangestop', response);
            Print(data.username + " Challenge Request Declined", "success");
        });
    }

    function onAcctept(data) {
        script3load = true;
        allow["Script3"] = true;
        ViewPage("Play",Script3);
    }

    function onDecline(data) {
        Print(data.username + " Declined your challenge request", "error");
    }

    function onMessage(data) {
        $('div.chatlist ul').html(data.message + $('div.chatlist ul').html());
        $("div.chatlist ul").animate({
            scrollTop: 0
        }, "fast");
    }

    function onRedirect(data) {
        window.location = data.url;
    }

    function onError(data) {
        Print("Error: " + data.message, "error");
    }
    socketListen('usersonline', onUsersOnline);
    socketListen('challangereq', onReq);
    socketListen('challangeaccepted', onAcctept);
    socketListen('challangedeclined', onDecline);
    socketListen('newmessage', onMessage);
    socketListen('redirect', onRedirect);
    socketListen('errormsg1', onError);
}
