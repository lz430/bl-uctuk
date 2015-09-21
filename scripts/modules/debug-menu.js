define(["jquery"], function ($) {
	var page = $('body'),
		debugMenu = $('[data-mz-role="debug"]'),
		closeButton = $('[data-mz-role="debug-close"]'),
		toggleMenu = function() {
			debugMenu.toggle();
		};

	$(document).ready(function () {
		page.on('dblclick', function (e) {
			if (e.ctrlKey || e.metaKey) {
				toggleMenu();
			}
		});

		closeButton.on('click', toggleMenu);

		window.console.log('Debug menu active. Cmd/Ctrl + double click to activate!');
	});
});