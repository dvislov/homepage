(function() {
  $(document).ready(function() {
    return $('.logo').click(function() {
      return $('.main').toggleClass('aside-closed');
    });
  });

}).call(this);
