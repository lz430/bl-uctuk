﻿define(['modules/backbone-mozu', 'underscore', 'modules/jquery-mozu', 'modules/models-cart', 'modules/cart-monitor'], function (Backbone, _, $, CartModels, CartMonitor) {

	var CartView = Backbone.MozuView.extend({
		templateName : "modules/cart/cart-table",
		updateQuantity : _.debounce(function(e) {
            var $qField = $(e.currentTarget),
                newQuantity = parseInt($qField.val(), 10),
                id = $qField.data('mz-cart-item'),
                item = this.model.get("items").get(id);

			if (item && !isNaN(newQuantity)) {
				item.set('quantity', newQuantity);
				item.saveQuantity();
			}
		}, 400),
		removeItem : function(e) {
            var $removeButton = $(e.currentTarget),
                id = $removeButton.data('mz-cart-item');
			this.model.removeItem(id);
			return false;
		},
		proceedAsGuest : function() {/*BL addition - 10/2014*/
			$(this).addClass('is-loading');
			$('#cartform').submit();
		},
        empty: function() {
            this.model.apiDel().then(function() {
                window.location.reload();
            });
        },
		proceedToCheckout : function() {
			//commenting  for ssl for now...
			//this.model.toOrder();
			// return false;
			this.model.isLoading(true);
			// the rest is done through a regular HTTP POST
		}
	});

	$(document).ready(function() {

        var cartModel = CartModels.Cart.fromCurrent(),
            cartView = new CartView({
			el : $('#cart'),
			model : cartModel,
			messagesEl : $('[data-mz-message-bar]')
		});

		cartModel.on('ordercreated', function(order) {
			cartModel.isLoading(true);
			window.location = "/checkout/" + order.prop('id');
		});

        cartModel.on('sync', function() {
            CartMonitor.setCount(cartModel.count());
        });

		window.cartView = cartView;

        CartMonitor.setCount(cartModel.count());

    $('#cart-checkout-top, #cart-checkout').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 300);
    });
	});

}); 