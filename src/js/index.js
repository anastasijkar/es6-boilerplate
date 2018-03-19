(function() {
  $('.nav__menu-icon-wrapper').click(function () {
    var menu = $('.nav__wrapper');
    if ($('.nav__wrapper').hasClass('active')) {
      menu.removeClass('active');
    } else {
      menu.addClass('active');
    }
  });

  $(document).ready(function() {
    $('#slides').fullpage({
      scrollBar: true,
      scrollOverflow: true
    });
  });
})();