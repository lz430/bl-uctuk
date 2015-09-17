require(["modules/jquery-mozu"], function($) {
	$(document).ready(function() {
		setSizes();
	});

	function setSizes() {
		$('.bl-collapsible-block-content').each(function() {
			var $this = $(this);
			var inner = $this.find('.bl-collapsible-block-content-inner');
			$this.css('maxHeight', inner.innerHeight() + 'px');
		});
	}

	function resizedw() {
		setSizes();
	}

	var timeout;

	$(window).on('resize', function() {
		clearTimeout(timeout);
		timeout = setTimeout(resizedw, 100);
	});

});
