define(['modules/jquery-mozu'], function($) {
  $(document).ready(function() {
    $('[data-mz-role="contact-form"]').each(function() {
      var $form = $(this);
      $form.on('submit', function(e) {
        e.preventDefault();
        var action = $form.prop('action');
        action += (action.indexOf('?') !== -1) ? "&" : "?";
        $.getJSON(action + $form.serialize() + "&callback=?").then(function(res) {
          if (res === "OK") {
            $form.html('<h3>Thank you! You should receive a confirmation shortly.</h3');
          } else {
            $form.append('<span class="mz-validationmessage">Sorry, an error occurred. Please make sure all fields are filled out!</span>');
          }
        });
      });
    });
  });
});