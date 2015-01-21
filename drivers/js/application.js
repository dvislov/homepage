(function() {
  $(document).ready(function() {
    return $('.driver .logo').click(function() {
      return $('.main').toggleClass('aside-closed');
    });
  });

}).call(this);
