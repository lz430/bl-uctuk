define(['modules/jquery-mozu', 'underscore', 'modules/backbone-mozu'], function($, _, Backbone) {
  function setLabelClasses(scope) {
    _.defer(function() {
      $('input[type=radio]', scope).each(function() {
          $(this).closest('label')[this.checked ? "addClass" : "removeClass"]('radio-selected');
      });
    });
  }
  $(document).ready(function() {
    $('body').on('input[type=radio]', 'change', function() {
      setLabelClasses();
    });
    Backbone.MozuView.on('render', function(view) {
      setLabelClasses(view.$el);
    });
    setLabelClasses();
  });
});