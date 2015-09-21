define(['jquery', 'underscore'], function($, _) {

  function ModalWindow(html) {
    if (typeof html !== 'undefined') this.loadWrapper(html);
    this.bindClose();
    // bind all methods specified on the prototype
    _.bindAll.apply(_, [this].concat(_.keys(proto)));
  }

  var proto;

  _.extend(ModalWindow.prototype, proto = {
    loadWrapper: function(html) {
      this.$wrapper = $(html);
    },
    open: function() {
      this.$wrapper.show();
      $(document).on('keyup', this.closeOnEscape);
    },
    close: function () {
        this.$wrapper.addClass('hidden');
      this.$wrapper.hide().remove();
    },
    bindClose: function() {
      if (this.$wrapper) this.$wrapper.on('click', '[data-mz-role="modal-close"]', this.close);
    },
    closeOnEscape: function(e) {
      if (e.which === 27) {
        this.close();
        $(document).off('keyup',this.closeOnEscape);
      }
    }
  });


  return ModalWindow;
});
