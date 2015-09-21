/*jshint strict:true, evil:true, boss:false, laxbreak:true, laxcomma:true, latedef:true, immed:true, newcap:true, noarg:true, nonew:true, plusplus:true, regexp:true, undef:true, unused:true, trailing:true, eqeqeq:true, curly:true, camelcase:true, bitwise:true */

define(['modules/jquery-mozu'
        , 'modules/backbone-mozu'
        , 'modules/api'
        , 'modules/modal'
        , 'hyprlive'
        , 'hyprlivecontext'
        , 'widgets/video',
        , 'vendor/viewport-units-buggyfill'
        , 'shim!vendor/jquery-fitvids[jquery=jQuery]'
        , '//www.youtube.com/iframe_api'
        ], function ($, Backbone, api, ModalWindow, Hypr, HyprLiveContext, videoLogic) {

  "use strict";
  var apiRoute = { youtubeFeedURL:  "https://gdata.youtube.com/feeds/base/users/__USERNAME__/uploads?v=2&alt=json" }

      , regex = {
            userName:     /__USERNAME__/gi
          , videoThumb:   /<img.+src="(.+\.jpg)">/i
          , extraArgs:    /&.+/gi
      }

      , YoutubeView = Backbone.MozuView.extend({
            templateName: "widgets/home/youtube-feed-list"
      })

      , modalTemplate = Hypr.getTemplate('modules/modal-video').render({
          host: window.location.host,
          returnUrl: window.location.pathname + window.location.search + window.location.hashMozuView
      }) // needs hostname since we don't currently have a siteContext url for this
  
      , themeSettings = HyprLiveContext.locals.themeSettings

      , VideoModal = function(videoId) {
          var self = this;
          ModalWindow.call(self, modalTemplate);
          self.$wrapper.appendTo('body');
          self.open();
          this.$wrapper.find('.mz-modal__inner').append('<div class="mz-product-video-placeholder" data-url="http://www.youtube.com/watch?v=' + videoId
                                  + '" data-aspect-ratio="' + themeSettings.productPageVideoAspectRatio + '">'
                                  + '<div class="mz-product-video-player"></div>'
                                  + '<div class="mz-product-video-cover"></div>'
                                 + '</div>');
          
       this.$wrapper.find('.mz-product-video-placeholder').each(videoLogic.bindVideo).fitVids();
      };

      require('vendor/viewport-units-buggyfill').init();

      VideoModal.create = function(videoId) {
        return new VideoModal(videoId);
      };

      $.extend(VideoModal.prototype = new ModalWindow(), {
        constructor: VideoModal
    });

  /**
   * PROMISE: get the Youtube feed JSON data
   * @param  string   username      [description]
   * @return string                 [description]
   */
  function getYoutubeFeed(username) {
      return $.getJSON(apiRoute.youtubeFeedURL.replace(regex.userName, username));
  }

  $(document).ready(function () {
    $('[data-mz-youtubefeed]').each(function (index, widgetInstance) {

      var config = $(widgetInstance).data('mzYoutubefeed')
        ;

      config.renderTarget = $('[data-mz-youtubefeed-container]');

      // PROMISE
      $.when(
        getYoutubeFeed(config.username)
      )
          // RESOLVE
          .then(function(youtubeFeed) {

            var feedEntries = $.map(youtubeFeed.feed.entry, function(val) {
              return {
                  title:  val.title.$t
                , thumb:  val.content.$t.match(regex.videoThumb)[1].replace(/default.jpg/, 'sddefault.jpg')
                , url:    val.link[0].href.replace(regex.extraArgs, '')
              };
            });

            feedEntries.length = config.numberToDisplay;

            // Render the view and append it to the renderTarget container
            var view = new YoutubeView({ el: config.renderTarget, model: new Backbone.Collection(feedEntries) });

            $.when(
              view.render()
            ).then(function(){
                $('.mz-home-feedlist__video-link').on('click', function(e){
                  var videoId = videoLogic.parseId(e.currentTarget.href);
                  if ($("[id='" + "youtube-player-" + videoId + "']").length === 0)
                  {
                    VideoModal.create(videoId);
                    return false;
                  }
                });
            });

          });
    });
  });

 return VideoModal;
});
