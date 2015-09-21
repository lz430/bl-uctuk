define(['jquery', 'hyprlive', 'require', 'modules/is-mobile', 'vendor/jquery-readmore'], function ($, Hypr, require, isMobile) {
  var customerId = Hypr.getThemeSetting('bazaarVoiceCustomerId');

  return {
    ready: function (cb) {
    },
    
    productSummary: function(selector, productCode) {
      this._display(selector, productCode, 'snippet');
    },
    
    productReviews: function(selector, productCode) {
      this._display(selector, productCode, 'engine');
    },

    _display: function(selector, productCode, mode) {
    }
  };
});