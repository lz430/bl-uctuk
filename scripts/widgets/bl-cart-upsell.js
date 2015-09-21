define(
	["modules/jquery-mozu","underscore", "hyprlive", "modules/api", "modules/backbone-mozu", 'modules/models-cart'], 
	function($, _, Hypr, api, Backbone, CartModel) {
		var UpsellProductView = function() {
			var self = this;
			
			/* Helper Functions */
			self.initialize = function(container, config) {
					self.config = config;
					self.upsellItemTemplate = 'widgets/catalog/cart-upsell/upsell-item';
					self.container = $(container);
					self.upsellProducts = {};
					self.currentCart = {};
					
					self.processCartItems(CartModel.Cart.fromCurrent());
			};
			self.processCartItems = function(currentCart) {
				currentCart.fetch().then(
					function(apiObj) {
						var products = apiObj.attributes.items.models;
						var cartProductList = [];
						var upsellProductList = [];
						self.currentCart = apiObj;
						
						/* Collect all the product info we care about once per product code */
						$.each(products, function(i, productModel) {
							if (cartProductList.indexOf(productModel.attributes.product.attributes.productCode) < 0){
								cartProductList.push(productModel.attributes.product.attributes.productCode);
								
								$.each(productModel.attributes.product.attributes.properties, function(k, attributeModel) {
									if (attributeModel.attributeFQN.toLowerCase() === self.config.attribute.toLowerCase() && attributeModel.values.length) {
										upsellProductList.push(attributeModel.values[0].stringValue);
									}
								});
							}
						});
		
						/* Don't upsell stuff already in the cart */
						upsellProductList = _.difference(upsellProductList, cartProductList);
						
						/* Only grab the configured max to display */
						upsellProductList = upsellProductList.slice(0, self.config.maxDisplay);
						
						/* Go get 'em */
						if (upsellProductList.length > 0) {
							self.retrieveUpsellProducts(upsellProductList).then(self.displayUpsellProducts);
						}
					}
				);
			};
			self.retrieveUpsellProducts = function(productList) {
					var filterval = "productCode eq " + productList.join(" or productCode eq ");
					var retval = '';
			
					retval = api.get("products", {
						filter : filterval
					});
			
					return retval;
			};
			self.displayUpsellProducts = function(productCollection) {
					self.upsellProducts = productCollection.data;
					var upsellContent = Hypr.getTemplate(self.upsellItemTemplate).render({
						Model : self.upsellProducts
					});
					self.container.html(upsellContent);
					
					/* Add listeners */
					self.container.on('click', 'input[id^="upsell-check-"]', self.handleSelect);
					self.container.on('click', '[data-bl-action="add-to-cart"]', self.addToCart);
			};
			self.handleSelect = function(event) {
				var $element = $(this);
				var button = $element.parents('[data-mz-product]').find('[data-bl-action="add-to-cart"]');
				
				if (button && $element.is(":checked")) {
					button.addClass('bl-cart-upsell-selected');
					button.prop({'disabled': null});
				} else {
					button.removeClass('bl-cart-upsell-selected');
					button.prop({'disabled': 'disabled'});
				}
			};
			self.addToCart = function(event) {
				var $element = $(this);
				var productCode = $element.parents('[data-mz-product]').data('mzProduct');
				
				//TODO: Do we want a loading graphic?
				/* Which product? */
				$.each(self.upsellProducts.items, function(i, product) {
					if (product.productCode.toLowerCase() === productCode.toLowerCase()) {
						//TODO: Make use of soft add style light box if product has options
						self.currentCart.apiAddProduct({
							product : product,
							quantity : 1
						}).then(function() {
							//Refresh!
							if (Hypr.engine.options.locals.pageContext.pageType === "cart") {
								window.location.reload();
							} else {
								//We have to do something else...reloading the page doesn't use the updated cart for display
								window.location.replace('/cart/checkout');
							}
						});
					}
				});
				
			};
		};
		
		//Document Ready
		$(document).ready(function() {
			var upsellContainer = $('[data-bl-role="cart-upsell"]');

			if (upsellContainer.length > 0) {
				var settings = upsellContainer.data('blConfig');
				var upsellProductView = new UpsellProductView();
				
				upsellProductView.initialize(upsellContainer, settings);
			}	
		});
	}
); 

