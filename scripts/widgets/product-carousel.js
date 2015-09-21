/*jshint strict:true, evil:true, boss:false, laxbreak:true, laxcomma:true, latedef:true, immed:true, newcap:true, noarg:true, nonew:true, plusplus:true, regexp:true, undef:true, unused:true, trailing:true, eqeqeq:true, curly:true, camelcase:true, bitwise:true */

define([
      'modules/jquery-mozu'
    , 'shim!vendor/owl-carousel/owl-carousel[jQuery=jquery]'
  ]

, function ($) {

    "use strict";

    $(document).ready(function () {

      $('[data-mz-product-carousel-widget]').each(function () {

        var $self       = $(this)
          , widgetName  = 'mz-product-carousel-widget'
          // , config      = $(widgetInstance).data('mzSlideshow')
          // , config      = $self.data('mzSlideshow')
          ;

        $self.owlCarousel({
            // singleItem:   true
          // , autoPlay:     true
          // , stopOnHover:  true
            navigation: true
            , navigationText : false
          // , autoHeight:   true
          , theme: widgetName
            ,lazyLoad: true
        });

        if (require.mozuData('pagecontext').isDebugMode) {
          console.log(widgetName);
        }

        // console.group(widgetName);
        // console.log('config', index);
        // console.groupEnd();

    });

  });

});
