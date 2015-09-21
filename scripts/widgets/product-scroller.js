define(["modules/jquery-mozu", "modules/backbone-mozu", "hyprlive", "modules/models-product", "modules/views-productimages"], function($, Backbone, Hypr, ProductModels, ProductImageViews) {

    var ProductScrollerProduct = Backbone.MozuView.extend({
        templateName : 'widgets/catalog/product-scroller/product',
        initialize : function() {
            // preload images
            /* var imageCache = this.imageCache = {};
             _.each(this.model.get('content').get('productImages'), function(img) {
             var i = $('<img/>')[0];
             i.src = img.imageUrl + "?max=" + Hypr.getThemeSetting('productImagesContainerWidth');
             imageCache[img.sequence.toString()] = i;
             });*/
        },
        render : function() {
            Backbone.MozuView.prototype.render.apply(this, arguments);
        }
    });
	$(document).ready(function() {
		var defaults = {
			// GENERAL
			mode : 'horizontal',
			slideSelector : '',
			infiniteLoop : true,
			hideControlOnEnd : false,
			speed : 3000,
			easing : null,
			slideMargin : 0,
			startSlide : 0,
			randomStart : false,
			captions : false,
			ticker : false,
			tickerHover : false,
			adaptiveHeight : false,
			adaptiveHeightSpeed : 500,
			video : false,
			useCSS : true,
			preloadImages : 'visible',
			responsive : true,
			slideZIndex : 50,
			wrapperClass : 'bl-slider-wrapper',

			// TOUCH
			touchEnabled : true,
			swipeThreshold : 50,
			oneToOneTouch : true,
			preventDefaultSwipeX : true,
			preventDefaultSwipeY : false,

			// PAGER
			pager : false,
			pagerType : 'full',
			pagerShortSeparator : ' / ',
			pagerSelector : null,
			buildPager : null,
			pagerCustom : null,

			// CONTROLS
			controls : true,
			nextText : 'Next',
			prevText : 'Prev',
			nextSelector : null,
			prevSelector : null,
			autoControls : false,
			startText : 'Start',
			stopText : 'Stop',
			autoControlsCombine : false,
			autoControlsSelector : null,

			// AUTO
			auto : true,
			pause : 4000,
			autoStart : true,
			autoDirection : 'next',
			autoHover : false,
			autoDelay : 0,
			autoSlideForOnePage : false,

			// CAROUSEL
			minSlides : 1,
			maxSlides : 1,
			moveSlides : 0,
			slideWidth : 0,

			// CALLBACKS
			onSliderLoad : function() {
			},
			onSlideBefore : function() {
			},
			onSlideAfter : function() {
			},
			onSlideNext : function() {
			},
			onSlidePrev : function() {
			},
			onSliderResize : function() {
			}
		};
		window.ProductModels = ProductModels;
		$('.bl-product-scroller').each(function() {
			var completeCount = 0;
			var $this = $(this);
			var widgetOptions = $.extend({}, defaults, $this.data('bl-product-scroller-config'));
            var options = {
                navigation : true, // Show next and prev buttons
                slideSpeed : widgetOptions.speed,
                navigationText: ["&lsaquo;","&rsaquo;"],
                paginationSpeed : 400,
                autoHeight: widgetOptions.adaptiveHeight,
                items : 3,
                itemsCustom : false,
                itemsDesktop : [1199,3],
                itemsDesktopSmall : [980,3],
                itemsTablet: [768,3],
                itemsTabletSmall: [640,2],
                itemsMobile : [480,1]
            };

			$.each(widgetOptions.products, function(i, e) {
				var product = new ProductModels.Product({
					productCode : e
				});
				var container = $('<div />');
				product.fetch().then(function() {
				    console.log(product.attributes.productCode);
					var productView = new ProductScrollerProduct({
						el : container,
						model : product
					});
					productView.render();
					$this.append(container);
					completeCount++;
					if (completeCount == widgetOptions.products.length) {
    				    //$this.bxSlider(widgetOptions);
                        $this.owlCarousel(options);
                        if (widgetOptions.wrapperClass) {
                            $this.wrap('<div class="'+widgetOptions.wrapperClass+'"></div>');
                        }
					}

				},function(){
				    completeCount++;
				    if (completeCount == widgetOptions.products.length) {
    				    //$this.bxSlider(widgetOptions);
                        $this.owlCarousel(options);
                        if (widgetOptions.wrapperClass) {
                            $this.wrap('<div class="'+widgetOptions.wrapperClass+'"></div>');
                        }
					}
				});

			});

		});
  });
});





