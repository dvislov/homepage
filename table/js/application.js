(function() {
  $(document).ready(function() {
    var initTableDiagonal, initTableFirstColumn, initTableFirstHeader, scrollPane, srcTableWrap;
    srcTableWrap = $("#excel_table");
    scrollPane = srcTableWrap.bind('jsp-scroll-x', function(event, scrollPositionX, isAtLeft, isAtRight) {
      $('.freeze-table-left-wrap').css({
        left: scrollPositionX
      });
      return $('.freeze-table-diagonal-wrap').css({
        left: scrollPositionX
      });
    }).bind('jsp-scroll-y', function(event, scrollPositionY, isAtTop, isAtBottom) {
      $('.freeze-table-top-wrap').css({
        top: scrollPositionY
      });
      return $('.freeze-table-diagonal-wrap').css({
        top: scrollPositionY
      });
    }).jScrollPane();
    initTableFirstHeader = function() {
      $('table.table:first').clone().addClass('freeze-table-top').appendTo('.table-wrap');
      $('.freeze-table-top').wrap('<div class="freeze-table-top-wrap"></div>');
      return $('.freeze-table-top-wrap').css({
        height: $('table.table:first thead').height()
      });
    };
    initTableFirstColumn = function() {
      var columnBorderWidth, columnWidth;
      $('table.table:first').clone().addClass('freeze-table-left').appendTo('.table-wrap');
      $('.freeze-table-left').wrap('<div class="freeze-table-left-wrap"></div>');
      columnBorderWidth = parseInt($('table.table:first tbody tr:first td:first').css("borderWidth"));
      columnWidth = parseInt($('table.table:first thead th:first').outerWidth());
      return $('.freeze-table-left-wrap').css({
        width: columnWidth + columnBorderWidth + "px"
      });
    };
    initTableDiagonal = function() {
      var elemBorderWidth, elemHeight, elemWidth;
      $('table.table:first').clone().addClass('freeze-table-diagonal').appendTo('.table-wrap');
      $('.freeze-table-diagonal').wrap('<div class="freeze-table-diagonal-wrap"></div>');
      elemBorderWidth = parseInt($('table.table:first tbody tr:first td:first').css("borderWidth"));
      elemWidth = parseInt($('table.table:first thead th:first').outerWidth());
      elemHeight = parseInt($('table.table:first thead').height());
      return $('.freeze-table-diagonal-wrap').css({
        width: elemWidth + elemBorderWidth + "px",
        height: elemHeight + "px"
      });
    };
    initTableFirstColumn();
    initTableFirstHeader();
    return initTableDiagonal();
  });

}).call(this);
