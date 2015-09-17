define(['modules/jquery-mozu', "modules/views-collections"], function($, CollectionViewFactory) {
    $(document).ready(function() {
            window.facetingViews = CollectionViewFactory.createFacetedCollectionViews({
                $body: $('[data-mz-category]'),
                $facets: $('[data-mz-facets]'),
                data: require.mozuData('facetedproducts')
            });
        
        /* BL facet toggle handler */
		if (window.facetingViews.facetPanel && $(window.facetingViews.facetPanel.el).find('.mz-l-sidebaritem ul').length > 0) {
			$(document).on('change', '#bl-sidebar-menu-toggle', function() {
				var element = $(this);
				if (element.prop('checked')) {
					element.parent().siblings('.mz-l-sidebar').addClass('bl-sidebar-menu-expanded');
				} else {
					element.parent().siblings('.mz-l-sidebar').removeClass('bl-sidebar-menu-expanded');
				}
			});
		} else {
			$('.bl-sidebar-menu-toggle').hide();
		}
    });
});