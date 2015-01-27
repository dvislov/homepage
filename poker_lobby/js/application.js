(function() {
  $(document).ready(function() {
    return $('.js-filter-button').click(function() {
      $(this).toggleClass('nav-link__active');
      return $('.js-filter-content').toggle();
    });
  });

}).call(this);
