define(['jquery', 'vendor/jquery-plugin-factory'], function($, PluginFactory) {
  var Tabs;

  // TODO: Should change from class selectors to role selectors
  Tabs = function(element, options) {
    var me = this;

    this.$element = $(element);

    this.$tabs = this.$element.find('.mz-tabs__link');

    this.$containers = this.$element.find('.mz-tab');

    this._activate(this.$tabs.first().data('mz-tabs-id'));

    this.$tabs.on('click tap', function() {
      me.handleClickTap(this);
    });
  };

  Tabs.ACTIVE_CLASS = 'is-active';

  $.extend(Tabs.prototype, {
    handleClickTap: function(tab) {
      var $tab = $(tab),
        tabId = $tab.data('mz-tabs-id');

      this.open(tabId);
    },
    
    open: function(tabId, scrollTo) {
      this._deactivate();
      this._activate(tabId);

      if (!scrollTo) return;

      $('html, body').animate({
        scrollTop: this.$element.offset().top - 10
      }, 300);
    },

    _deactivate: function() { 
      if (this.$tabs.filter('.' + Tabs.ACTIVE_CLASS).data('mz-tabs-id') == 'videos') {
        $('body').trigger('productVideoHidden');
      }

      this.$tabs.removeClass(Tabs.ACTIVE_CLASS);
      this.$containers.removeClass(Tabs.ACTIVE_CLASS);
    },

    _activate: function(tabId) {
      this.$element.find('[data-mz-tabs-id="' + tabId + '"]').addClass(Tabs.ACTIVE_CLASS);
    }
  });

  PluginFactory(Tabs, 'seismic.mzTabs');

  $(document).ready(function() {
    $('.mz-tabs').mzTabs();
  });

});
