(function() {
  $(document).ready(function() {
    return $('.driver .logo').click(function() {
      return $('.main').toggleClass('aside-closed');
    });
  });

  $(document).ready(function() {
    return $('.driver-item').mouseenter(function() {
      return $('.route-summary').addClass('visible');
    }).mouseleave(function() {
      return $('.route-summary').removeClass('visible');
    });
  });

}).call(this);
