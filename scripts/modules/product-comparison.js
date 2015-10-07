define(['modules/jquery-mozu', "hyprlive", "modules/api", "modules/backbone-mozu", "modules/models-product"], function($, Hypr, api, Backbone, ProductModels) {
	var getProducts = function(productList) {
		var filterval = "productCode eq " + productList.join(" or productCode eq ");
		var retval = '';

		retval = api.get("products", {
			filter : filterval
		});

		return retval;
	};
	var processData = function(productCollection) {
		var extra = {
			properties : {},
			products : []
		};

		$.each(productCollection.items, function(i, product) {
			var propertiesList = {};

			//Clean up product data to make tabulating easier
			$.each(product.properties, function(k, property) {
				if (!property.isHidden) {
					propertiesList[property.attributeFQN] = property;
					extra.properties[property.attributeFQN] = property.attributeDetail.name;
				}
			});

			//On sale?
			if (product.price && product.price.hasOwnProperty('salePrice')) {
				product.price.onSale = true;
			}
			if (product.priceRange) {
				product.hasPriceRange = true;
			}
			extra.products.push({
				properties : propertiesList
			});
		});

		return extra;
	};
	var compareProducts = function() {
		var products = $('.bl-product-comparison-toggle input:checked');
		var productList = [];

		//Collect product codes
		$.each(products, function(i, product) {
			var value = $(product).val();
			if (value) {
				productList.push(value);
			}

			//Limit?
			if (productList.length == 4) {
				return false;
				//Break out of the loop, we're done.
			}
		});

		if (productList.length > 1) {
			//Get data
			getProducts(productList).then(function(collection) {
				var content = lightboxView.find('.bl-l-lightbox-content');
				var ProductComparisonView = Backbone.MozuView.extend({
					templateName : 'modules/product/product-comparison'
				});
				var processedData = processData(collection.data);
				var productComparisonView = Hypr.getTemplate('modules/product/product-comparison').render({
					Model : collection.data,
					Extra : processedData
				});
				var table = content.find('table');
				//Show It (nice)
				content.html(productComparisonView);
				table.css({
					visibility : 'hidden'
				});
				lightboxView.addClass('bl-l-lightbox-active');

				//Update table var info
				table = content.find('table');

				//Animate
				content.animate({
					width : table.outerWidth() + 'px'
				});
				table.css({
					visibility : 'visible'
				});
				$('html, body').animate({
					scrollTop : (content.offset().top - 15)
				});

			});
		} else {
			lightboxView.removeClass('bl-l-lightbox-active');
		}//End: if (productList.length > 0)
	};
	var removeProduct = function() {
		var element = $(this);
		var productCode = element.parents('[data-bl-product]').data('blProduct');

		//Uncheck selected, render lightbox
		$('.bl-product-comparison-toggle [value="' + productCode + '"]').click();
		compareProducts();
	};
	var closeLightbox = function() {
		$(this).parents('.bl-l-lightbox').removeClass('bl-l-lightbox-active');
	};
	var lightboxView = $(Hypr.getTemplate('modules/common/lightbox').render());
	$(document).ready(function() {
		//Place lightbox elements on the page
		$('body').append(lightboxView);
		lightboxView.addClass('bl-product-comparison-overlay');

		//Listen for comparison requests
		$('body').on('click', '[data-bl-action="compare"]', compareProducts);
		$('body').on('click', '[data-bl-action="remove"]', removeProduct);
		$('body').on('click', '[data-bl-action="close-lightbox"]', closeLightbox);
	});
}//End: function($, Hypr, api, Backbone, ProductModels)
);
