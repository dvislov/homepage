(function() {
  $(document).ready(function() {
    $("[data-action='change-form-edit-state']").click(function() {
      $("[data-object='vcard-form']").toggleClass('editable');
      if ($(".vcard-form input[type='submit']").attr('disabled')) {
        $(".vcard-form input[type='submit']").removeAttr('disabled');
      } else {
        $(".vcard-form input[type='submit']").attr('disabled', 'disabled');
      }
      $('.vcard-name').focus();
      if ($('.vcard-site').val() === "") {
        $('.vcard-site').val("www.marble-x.ru");
      }
      if ($('.vcard-input').attr('readonly')) {
        $('.vcard-input').removeAttr('readonly');
      } else {
        $('.vcard-input').attr('readonly', 'readonly');
      }
      if ($("[data-object='vcard-form']").hasClass('editable')) {
        return $('.vcard-input').parents('.control-group').show();
      } else {
        return $('.vcard-input').each(function() {
          if ($(this).val() === "") {
            return $(this).parents('.control-group').hide();
          }
        });
      }
    });
    $('[data-action="clear-self-input-value"]').click(function() {
      if ($(this).hasClass('controls-remove-address')) {
        return $('.vcard-address-line1, .vcard-address-line2').val("");
      } else {
        return $(this).prev('.vcard-input').val("");
      }
    });
    return $('[data-action="change-form-open-state"]').click(function() {
      $('.vcard-editor').slideToggle();
      if ($(".btn-form-state").attr('disabled')) {
        return $(".btn-form-state").removeAttr('disabled');
      } else {
        return $(".btn-form-state").attr('disabled', 'disabled');
      }
    });
  });

}).call(this);
