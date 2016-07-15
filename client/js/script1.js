(function () {

  $('.header').animateCss('bounceInLeft');
  $('.header2').animateCss('bounceInDown');
  $('#username').animateCss('bounceInRight');
  $('#connect').animateCss('bounceInUp');

    $('#username').keydown(function (event) {
        if (event.which == "13") {
            login();
        }
    });
})();
