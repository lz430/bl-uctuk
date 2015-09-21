/*jshint strict:true, evil:true, boss:false, laxbreak:true, laxcomma:true, latedef:true, immed:true, newcap:true, noarg:true, nonew:true, plusplus:true, regexp:true, undef:true, unused:true, trailing:true, eqeqeq:true, curly:true, camelcase:true, bitwise:true */

define([
    'modules/jquery-mozu'
  , 'hyprlive'
  ]

  , function($, Hypr) {

      "use strict";

      $(document).ready(function() {

        var liveChatID = Hypr.getThemeSetting('volusionLiveChatAccountID');
        var se = document.createElement('script');
        se.type = 'text/javascript';
        se.async = true;
        se.src = '//commondatastorage.googleapis.com/volusionchat/js/' + liveChatID + '.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(se, s);

        $('[data-mz-chat-state]').each(function() {
          var $this = $(this),
            data = $this.data();
          $this.prop('src',"https://volusionchat.appspot.com/statusImage?" + $.param({
            w: liveChatID,
            on: data.mzOnlineImage,
            off: data.mzOfflineImage
          }));
        });


      });


  });
