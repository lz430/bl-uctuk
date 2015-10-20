define(['modules/jquery-mozu'], function($) {
	var close = '[data-bl-action="closeLightbox"]', open = '[data-bl-action="openLightbox"]';

	//Listen for close
	$('body, .bl-l-lightbox-overlay').on('click', close, function(event) {
		var element = $(this), container = $('.bl-l-lightbox');

		if ($(event.target).data('blAction') === "closeLightbox") {
			var formId = element.data('blSubmit');
			container.removeClass('bl-l-lightbox-active');

			if (formId) {
				var $form = $('#' + formId);
				$form.addClass('is-loading');
				$form.submit();
			}
		}
	});

	//Listen for open
	$('body').on('click', open, function(event) {
		event.preventDefault();

		var element = $(this), container = $('.bl-l-lightbox');

		container.addClass('bl-l-lightbox-active');
	});
}); 