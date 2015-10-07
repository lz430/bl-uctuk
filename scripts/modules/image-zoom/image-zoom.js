require(["modules/jquery-mozu", "hyprlive", "modules/backbone-mozu", "modules/models-product", "modules/views-productimages", "modules/jquery-dateinput-localized"], function($, Hypr, Backbone, ProductModels, ProductImageViews) {
    var Event = window.Event, Magnifier = window.Magnifier;
    var BLPhotoLightboxView = Backbone.MozuView.extend({
        templateName: 'modules/product/photo-zoom-lightbox-content',
        render: function() {
            var me = this;
            Backbone.MozuView.prototype.render.apply(this);
        },

        initialize: function() {
            // handle preset selects, etc
            var me = this;
        }
    });

    var BLLightboxModel = ProductModels.Product.extend({
        imageSize: null,
        helpers: ['currentImage', 'maxImageSize', 'thumbImageSize'],
        currentImage: function() {
            var imgs = this.get('content').get("productImages"),
                img = imgs && imgs[imageIndex];
            return img || {
                imageUrl: 'http://placehold.it/160&text=' + Hypr.getLabel('noImages')
            };
        },
        maxImageSize: function() {
            return config.largePhotoMax;
        },
        thumbImageSize: function() {
            return config.thumbPhotoMax;
        }
    });

    var $this, anchor, mainImg, config, lbModel, product, imageIndex;

    //Setup the defaults
    config = {
        zoomLvl: 2,
        magEnabled: true,
        lbEnabled: true,
        largePhotoMax: 800,
        thumbPhotoMax: 50

    };

    var useImageZoom = function() {
        return !Modernizr.mq('(max-width: 480px)');
    };

    function initMagnify() {
        var evt = new Event();
        var m = new Magnifier(evt);
        var imgWidth = Hypr.getThemeSetting('productImagesContainerWidth');
        var zoom = Hypr.getThemeSetting('photoMagnifierZoomLevel');
        if (zoom !== undefined && zoom !== null && !isNaN(zoom)) {
            config.zoomLvl = zoom;
        }

        m.attach({
            thumb: '.mz-productimages-mainimage',
            large: removeQueryString(mainImg.attr('src')) + "?max=" + (imgWidth * config.zoomLvl),
            mode: 'inside',
            zoom: config.zoomLvl
        });

        mainImg.load(function() {
            $('#magnifier-item-0-large').remove();
            $('.magnifier-loader').remove();
            m.attach({
                thumb: '.mz-productimages-mainimage',
                large: removeQueryString(mainImg.attr('src')) + "?max=" + (imgWidth * config.zoomLvl),
                mode: 'inside',
                zoom: config.zoomLvl
            });
        });
    }

    function initLightBox() {
        var photoMax = Hypr.getThemeSetting('photoLightboxLargePhotoMax');
        if (photoMax !== undefined && photoMax !== null && !isNaN(photoMax)) {
            config.largePhotoMax = photoMax;
        }
        var thumbMax = Hypr.getThemeSetting('photoLightboxThumbMax');
        if (thumbMax !== undefined && thumbMax !== null && !isNaN(thumbMax)) {
            config.thumbPhotoMax = thumbMax;
        }

        product = BLLightboxModel.fromCurrent();

        //Add lightbox outer template to page
        //			 Hypr.getTemplate('modules/cart/cart-summary').render();
        var lbHTML = Hypr.getTemplate('modules/product/photo-zoom-lightbox-outer').render();
        $('body').append(lbHTML);


        imageIndex = 0;
        $('.mz-productimages-thumb').on('click', function() {
            imageIndex = $(this).data('mz-productimage-thumb') - 1;

        });

        $('.bl-iz-lightbox-content').css({
            width: config.largePhotoMax + 'px'
        });

        $('.magnifier-thumb-wrapper').on('click', renderLightbox);

        $('*[data-bl-action="iz-close-lb"]').on('click', function() {
            closeLightbox();
        });

    }

    function showLightbox() {
        $('.bl-iz-lightbox').addClass('bl-iz-lightbox-active');
    }

    function closeLightbox() {
        $('.bl-iz-lightbox').removeClass('bl-iz-lightbox-active');
    }

    function renderLightbox() {

        var view = new BLPhotoLightboxView({
            el: $('.bl-iz-lightbox-content-inner'),
            model: product
        });

        view.render();

        $('.bl-iz-productimages-thumb').on('click', function(e) {
            e.preventDefault();

            var $thumb = $(this);
            var bigImage = $('.bl-iz-productimages-mainimage');
            var productImages = product.apiModel.data.content.productImages;
            var thumbIndex = $thumb.data('bl-iz-productimage-thumb') - 1;
            var newImage = productImages[thumbIndex];

            $('.bl-iz-productimages-thumb').removeClass('bl-iz-thumb-selected');
            $thumb.addClass('bl-iz-thumb-selected');

            bigImage.attr('src', newImage.imageUrl + "?max=" + config.largePhotoMax);

        });

        showLightbox();
    }

    function removeQueryString(url) {
        return url.split("?")[0];
    }


    $(document).ready(function() {
        $this = $('.bl-image-zoom');
        if (Hypr.getThemeSetting('enablePhotoMagnifier') !== undefined) {
            config.magEnabled = Hypr.getThemeSetting('enablePhotoMagnifier');
        }
        if (Hypr.getThemeSetting('enablePhotoLightbox') !== undefined) {
            config.lbEnabled = Hypr.getThemeSetting('enablePhotoLightbox');
        }

        //Only do anything something is enabled
        if (!config.magEnabled && !config.lbEnabled) {
            return;
        }

        anchor = $('<a href="javascript:void(0)" />').addClass('magnifier-thumb-wrapper');
        mainImg = $('.mz-productimages-mainimage');
        mainImg.wrap(anchor);
        if (config.magEnabled && useImageZoom()) {

            initMagnify();
        }

        if (config.lbEnabled && useImageZoom()) {
            initLightBox();
        }

    });
});