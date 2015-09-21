require([
				'modules/jquery-mozu',
				'underscore',
				'modules/modal',
				'hyprlive',
				'modules/api',
				'modules/models-product',
				'modules/views-productimages',
				'modules/soft-cart',
				'modules/tabbed-box'
		],
		function ($, _, ModalWindow, Hypr, Api, ProductModels, ProductImageViews, BazaarVoice, SoftCart) {

				var modalTemplate = Hypr.getTemplate('modules/product/product-quickview'),
						QuickView,
						modal;

				QuickView = function(productCode) {
						var self = this;
						Api.get('product', productCode).then(function(sdkProduct) {
								var product = new ProductModels.Product(sdkProduct.data);
								self.render(modalTemplate.render({ model: product.toJSON({ helpers: true }) }));
								self.imagesView = new ProductImageViews.ProductPageImagesView({
										el: self.$wrapper.find('[data-mz-productimages]'),
										model: product
								});
								self.$wrapper.on('click', '[data-mz-action="view-details"]', function() {
										window.location = product.get('url');
								}).on('click', '[data-mz-action="add-to-cart"]', function() {
										product.addToCart(1);
										product.on('addedtocart', function() {
												self.close();
												SoftCart.view.$el.ScrollTo();
												SoftCart.update().then(function() { SoftCart.show(); });
										});
								});

						});
				};

				$.extend(QuickView.prototype = new ModalWindow(), {
						constructor: QuickView,
						render: function(html) {
								var $modal = $(html);

								this.loadWrapper($modal.appendTo('body'));

								$modal.find('.mz-tabs').mzTabs();
								this.bindClose();
								this.open();

								BazaarVoice.productSummary('[data-mz-role="mz-product-quickview-review-summary"]');
						},

						loadReviewSummary: function() {

						}
				});

				$(document).ready(function() {
						var $buttons = $('[data-mz-quickview-button]');

						$('#mz-content-section').on('click', '[data-mz-quickview-button]', _.debounce(function(e) {
								modal = new QuickView($(e.currentTarget).data('mz-product-code'));
						}, 300, true));
				});

				if (require.mozuData('pagecontext').isDebugMode) {
				}
		}
);
