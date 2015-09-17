define(['modules/jquery-mozu'],
    function ($) {
        $('.bl-nav-promo-widget[data-bl-promo-id]').each(function (index, element) {
            element = $(element);
			var promoId = element.data("blPromoId");
            if (promoId) {
				var navContainer = $('.bl-sitenav-promo[data-bl-promo-id="' + promoId + '"]');
				if (navContainer.length > 0) {
					navContainer.append(element);
					element.show();
				} else if (element.data("blPromoShowOrphan").toLowerCase() === "true") {
					element.show();
				}
			}
		});
    }
);