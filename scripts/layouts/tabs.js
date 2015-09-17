define(['modules/jquery-mozu'], function($) {
	var container = $('.bl-l-tabs'), tabMenu = $('<li />').addClass('bl-l-tabs-menu');

	$('.bl-l-tabs-sectiontitle').each(function(index, element) {
		element = $(element);
		var section = element.parent();
		if (section.length > 0) {
			var wrapper = $('<div />').addClass('bl-l-tabs-menu-tab-wrapper').attr({
				'data-bl-tabs-section-id' : index
			}), tab = $('<span />').addClass('bl-l-tabs-menu-tab');

			//Hide section, add ID
			section.addClass('bl-l-tabs-section-inactive');
			section.attr({
				'data-bl-tabs-section-id' : index
			});

			//Fill in tab text
			tab.append(element.html());

			//Add menu item
			tabMenu.append(wrapper.append(tab));

			//Listen for clicks
			wrapper.click(function(event) {
				var menuTab = $(this), section = $('.bl-l-tabs-section[data-bl-tabs-section-id="' + menuTab.data('blTabsSectionId') + '"]');

				//Indicate tab
				menuTab.siblings().removeClass('bl-l-tabs-menu-selected');
				menuTab.addClass().addClass('bl-l-tabs-menu-selected');

				if (section.length > 0) {
					//Show section
					section.siblings('.bl-l-tabs-section').addClass('bl-l-tabs-section-inactive');
					section.removeClass('bl-l-tabs-section-inactive');
				}

			});
			element.click(function(event) {
				var sectionTitle = $(this);
				sectionTitle.parent().toggleClass('bl-l-tabs-section-inactive');
			});
		}
	});

	container.prepend(tabMenu);
	if (tabMenu.children().length > 0) {
		var firstTab = tabMenu.children().first();
		//Add selected class to first menu tab
		firstTab.addClass('bl-l-tabs-menu-selected');
		$('[data-bl-tabs-section-id="' + firstTab.attr('data-bl-tabs-section-id') + '"]').removeClass('bl-l-tabs-section-inactive');
	}
}); 