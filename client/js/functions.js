//function animate2(element, animationName,handle) {
//    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
//    var anim = animationName + ' animated';
//    //alert(handle)
//    element.addClass(anim);
//    element.one(animationEnd,function(){
//        element.removeClass(anim);
//        handle();
//    })
//}
ViewPage("Setname", function () {});
var allow = [];
allow["Script1"] = false;
allow["Script2"] = true;
allow["Script3"] = true;

function ViewPage(name, handle) {
    var data = $('.' + name).html();
    if (name != "Setname") {
        $('body').animateCss('fadeOutUp');
        $('body').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            
            if (name == "Challenge" && !allow["Script2"]) {
                console.log(name+","+allow["Script2"]);
                return;
            }
            if (name == "Play" && !allow["Script3"]) {
                console.log(name+","+allow["Script3"]);
                return;
            }
            $('#content').html(data);
            //$('body').css("animation-delay", "1s");
            console.log('Calling');
            handle();
            console.log('Called');
            //alert( $('#content').html());
            console.log('contented changed');
            $('body').animateCss('fadeIn');
            console.log('fadeIn Called');
        });
    } else
        $('#content').html(data);

}
var last;

function Print(text, type) {
    if (text == last)
        return;
    alertify.parent($('body')[0]);
    switch (type) {
        case "success":
            alertify.success(text);
            break;
        case "error":
            alertify.error(text);
            break;
        default:
            alertify.log(text);
            break;
    }
    last = text;
    setTimeout(function () {
        last = Math.random();
    }, 4000);
}

function login() {
    if ($('#username').val().length < 6) {
        Print("Invaid Username: Minimum Six(6) characters allowed.", "error");
        return false;
    }
    socket.emit('userlogin', {
        username: $('#username').val(),
        time: (new Date).toString()
    });
    username = $('#username').val();
    ViewPage("Challenge", Script2);
}

function socketListen(name, handle) {
    socket.removeAllListeners(name);
    socket.on(name, handle);
}
