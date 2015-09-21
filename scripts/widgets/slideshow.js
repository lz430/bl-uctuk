/*jshint strict:true, evil:true, boss:false, laxbreak:true, laxcomma:true, latedef:true, immed:true, newcap:true, noarg:true, nonew:true, plusplus:true, regexp:true, undef:true, unused:true, trailing:true, eqeqeq:true, curly:true, camelcase:true, bitwise:true */
define(['modules/jquery-mozu', 'shim!vendor/owl-carousel/owl-carousel[jQuery=jquery]'], function($, BazaarVoice) {"use strict";
    $('.mz-home-gallery__slideshow .lazyOwl').each(function() {
        $(this).attr('data-src', $(this).attr('data-src') + '?max=' + $(window).width());
    });

    $(document).ready(function() {
        $('[data-mz-slideshow]').each(function(index, widgetInstance) {

            var $self = $(this)
            //,  config  = $(widgetInstance).data('mzSlideshow')
            , config = $self.data('mzSlideshow'), widgetName = 'mz-widget-homepage-slider';

            $self.owlCarousel({
                singleItem : true,
                autoPlay : true,
                stopOnHover : true,
                navigation : true,
                autoHeight : true,
                lazyLoad : true,
                theme : widgetName

                // [TFS: 24161] Add BazaarVoice widget instance to products
                ,
                afterInit : function(elem) {
                    BazaarVoice.productSummary('[data-mz-role="product-listing-review"]');

                    // Render view controls on top
                    this.owlControls.prependTo(elem);
                    $self.append('<div class="clearfix"></div>');
                }
            });

            if (require.mozuData('pagecontext').isDebugMode) {
                if (console.group) {
                    console.group(widgetName);
                }
                console.log('config', config, index, widgetInstance);
                if (console.groupEnd) {
                    console.groupEnd();
                }
            }

            $('.slideshow-pause').on('click', function() {

                var icon = $(this).find('i');

                if (icon.hasClass("icon-pause")) {
                    $self.trigger("owl.stop");
                } else {
                    $self.trigger("owl.play", 5000);
                    $self.trigger("owl.next");
                }

                icon.toggleClass('icon-pause icon-play');
            });
        });
    });
});
