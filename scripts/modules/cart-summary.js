/**
 * Adds cart summary window, soft add notification and cart count and total display
 */
define(['shim!vendor/bootstrap/js/popover[shim!vendor/bootstrap/js/tooltip[modules/jquery-mozu=jQuery]>jQuery=jQuery]>jQuery', 'modules/api', 'hyprlive', 'underscore', "modules/backbone-mozu", 'modules/models-cart'],
function($, api, Hypr, _, Backbone, CartModels) {
	Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep) {
		var n = this, c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
		d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

		t = ( typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

		sign = (n < 0) ? '-' : '',

		//extracting the absolute value of the integer part of the number and converting to string
		i = parseInt( n = Math.abs(n).toFixed(c), 10) + '', j = (( j = i.length) > 3) ? j % 3 : 0;
		return sign + ( j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ( c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
	};
	var CartSummaryView = Backbone.MozuView.extend({
		templateName : 'modules/cart/cart-summary',
		render : function() {
			var me = this;
			Backbone.MozuView.prototype.render.apply(this);
		},

		initialize : function() {
			// handle preset selects, etc
			var me = this;

		},
		updateQuantity : _.debounce(function(e) {
			var $qField = $(e.currentTarget),
			newQuantity = parseInt($qField.val(), 10),
			id = $qField.data('mz-cart-item'),
			item = this.model.get("items").get(id);

			if (item && !isNaN(newQuantity)) {
				item.set('quantity', newQuantity);
				item.saveQuantity();
				// window.cartItem = item;
			}
		}, 400),
		removeItem : function(e) {
			var $removeButton = $(e.currentTarget), id = $removeButton.data('mz-cart-item');
			this.model.removeItem(id);
			return false;
		},
		proceedToCheckout : function() {
			this.model.isLoading(true);
			window.location.href = "/cart";
		}
	});

	var usePopovers = function() {
		return !Modernizr.mq('(max-width: 480px)');
	}, returnFalse = function() {
		return false;
	}, $docBody;

	var DismissablePopover = function() {
	};

	$.extend(DismissablePopover.prototype, {
		boundMethods : [],
		setMethodContext : function() {
			for (var i = this.boundMethods.length - 1; i >= 0; i--) {
				this[this.boundMethods[i]] = $.proxy(this[this.boundMethods[i]], this);
			}
		},
		dismisser : function(e) {
			if (this.popoverInstance === null) {
				return;
			}
			if (!$.contains(this.popoverInstance.$tip[0], e.target) && !this.loading) {
				// clicking away from a popped popover should dismiss it
				this.$el.popover('destroy');
				this.$el.on('click', this.createPopover);
				this.$el.off('click', returnFalse);
				this.bindListeners(false);
				this.popoverInstance = null;
				$docBody.off('click', this.dismisser);
				this.isOpen = false;
			}
		},
		setLoading : function(yes) {
			this.loading = yes;
			this.$parent[yes ? 'addClass' : 'removeClass']('is-loading');
		},
		createPopover : function(e) {
			// in the absence of JS or in a small viewport, these links go to the cart page.
			// Prevent them from going there!
			var self = this;
			if (usePopovers()) {
				if (e !== null && e !== undefined) {
					e.preventDefault();
				}
				// If the parent element's not positioned at least relative,
				// the popover won't move with a window resize
				//var pos = $parent.css('position');
				//if (!pos || pos === "static") $parent.css('position', 'relative');

				this.$el.popover({
					placement : "bottom",
					animation : true,
					html : true,
					trigger : 'manual',
					content : this.template,
					container : '.bl-utilitynav-cartlink'
				}).on('shown.bs.popover', this.onPopoverShow);

				this.popoverInstance = this.$el.data('bs.popover');
				this.$parent = this.popoverInstance.tip();
				this.$parent.addClass('bl-cartsummary-popover');

				this.$el.popover('show');

			}
		},
		displayApiMessage : function(xhr) {
			this.displayMessage(xhr.message || (xhr && xhr.responseJSON && xhr.responseJSON.message) || Hypr.getLabel('unexpectedError'));
		},
		displayMessage : function(msg) {
			this.setLoading(false);
			this.$parent.find('[data-mz-role="popover-message"]').html('<span class="mz-validationmessage">' + msg + '</span>');
		},
		init : function(el) {
			this.$el = $(el);
			this.loading = false;
			this.setMethodContext();
			this.$el.on('click', this.createPopover);
			this.cartModel = CartModels.Cart.fromCurrent();
		}
	});

	var notification = Hypr.getThemeSetting('softAddNotification');
	var notificationMessage = Hypr.getThemeSetting('softAddNotificationMessage');

	function checkForCartUpdates(apiObject) {
		if (!apiObject || !apiObject.type)
			return;
		switch (apiObject.type) {
			case "cartitem":
				if (!apiObject.unsynced)
					showCartNotification(apiObject);
				//var cartInfo = parseCartInfo(apiObject);
				//updateCartInfo(cartInfo);
				break;
			case "cartsummary":
			case "cart":
				if (!apiObject.unsynced) {
					var cartInfo = parseCartInfo(apiObject);
					updateCartInfo(cartInfo);
				}
				break;
		}
	}

	function showCartNotification(apiObject) {//Do nothing if on the cart page or the cart summary is already open
		if (window.location.pathname == '/cart' || CartSummaryWindow.isOpen) {
			return;
		}

		if (notification == "Cart Summary") {
			CartSummaryWindow.createPopover();
		} else if (notification == "Acknowledgement") {
			var msg = notificationMessage.replace('#{productName}', apiObject.data.product.name);

			jQuery.notific8(msg, {
				life : Hypr.getThemeSetting('softAddNotificationDisplayTime')
			});
		}

	}

	var CartSummaryPopover = function() {
		DismissablePopover.apply(this, arguments);
	};
	CartSummaryPopover.prototype = new DismissablePopover();
	$.extend(CartSummaryPopover.prototype, DismissablePopover.prototype, {
		boundMethods : ['handleEnterKey', 'dismisser', 'displayMessage', 'displayApiMessage', 'createPopover', 'onPopoverShow'],
		template : Hypr.getTemplate('modules/cart/cart-summary').render(),
		isOpen : false,
		bindListeners : function(on) {

		},
		handleEnterKey : function(e) {

		},
		validate : function(payload) {
			return true;
		},
		getCart : function(self) {
			self.cartModel.fetch().then(function(apiResp) {
				self.renderCartSummary(self);
			});
		},
		renderCartSummary : function(self) {
			var view = new CartSummaryView({
				el : $('.popover-content'),
				model : self.cartModel
			});
			window.cartSummaryView = view;
			view.render();
			self.setLoading(false);
			self.isOpen = true;

		},
		onPopoverShow : function() {
			var self = this;

			_.defer(function() {
				$docBody.on('click', self.dismisser);
				self.$el.on('click', returnFalse);
			});

			this.bindListeners(true);
			this.$el.off('click', this.createPopover);
			this.setLoading(true);
			this.getCart(self);
		}
	});

	function parseCartInfo(apiObj) {
		var cartInfo = {
			quantity : null,
			total : null
		};
		try {

			cartInfo.quantity = apiObj.data.totalQuantity || getQty(apiObj.data.items);
			/*
			 cartInfo.discountedTotal	= apiObj.data.discountedTotal;
			 cartInfo.subtotal			= apiObj.data.subtotal;*/
			cartInfo.total = apiObj.data.total;
			return cartInfo;
		} catch (ex) {
			return cartInfo;
		}

	}

	function getQty(items) {
		try {
			var qty = 0;
			$.each(items, function(i, e) {
				qty += e.quantity;
			});
			return qty;
		} catch (e) {
			return 0;
		}
	}

	function updateCartInfo(cartInfo) {
		$.each(cartInfo, function(i, e) {
			var ele = $('[data-bl-cart-' + i + ']');
			var val = e;
			if (i !== 'quantity' && e !== null && e !== undefined) {
				val = e.toMoney();
			}
			//If there is no brandlabs quantity identifier, is there a mozu one?
			if (i === 'quantity' && ele.length < 1) {
				ele = $('[data-mz-role="cartmonitor"]');
			}
			ele.text(val);
		});
		saveCartInfo(cartInfo);
	}

	function getCartInfo() {
		var cookieVal = $.cookie('blcartInfo');
		if (cookieVal === null || cookieVal === undefined) {
			api.get('cartsummary').then(function(apiObject) {
				checkForCartUpdates(apiObject);
			});
			return;
		}

		var cartInfo = JSON.parse(cookieVal);
		updateCartInfo(cartInfo);
	}

	function saveCartInfo(cartInfo) {
		$.cookie('blcartInfo', JSON.stringify(cartInfo), { path : '/' });
		//Update mozu's cookie too, in case other things rely on it.
		$.cookie('mozucartcount', JSON.stringify(cartInfo), { path: '/' });
	}

	var CartSummaryWindow = new CartSummaryPopover();

	$(document).ready(function() {
		$docBody = $(document.body);
		var linkSelector = Hypr.getThemeSetting('cartSummaryLinkSelector');

		$(linkSelector).each(function() {
			CartSummaryWindow.init(this);
			$(this).parent().addClass('bl-utilitynav-cartlink');
			$(this).data('mz.popover', CartSummaryWindow);
		});

		api.on('sync', checkForCartUpdates);
		api.on('spawn', checkForCartUpdates);
		getCartInfo();
	});

});