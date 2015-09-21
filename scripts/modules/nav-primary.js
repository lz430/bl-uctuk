require(['jquery'], function ($) {
	//$(function() {
	//	var $target = $('.mz-nav-target'),
	//		triggerClass = '.mz-nav-trigger';

	//	$target.on('mouseover', function() {
	//		$(this).parent(triggerClass).addClass('is-hovered');
	//	}).on('mouseout', function() {
	//		$(this).parent(triggerClass).removeClass('is-hovered');
	//	});
	//});
});

require(['jquery', 'vendor/bootstrap'], function($) {
    $(document).ready(function() {
        //Change icons for mobile accordion
        $('#accordionAltNav').on('show.bs.collapse hide.bs.collapse', function (n) {
            $(n.target).siblings('.panel-heading').find('.panel-title').find('i').toggleClass('icon-plus-square icon-minus-square');
        });

        //Make all image links responsive
        $(".mz-home-adblock__link").children("img").each(function() {
            $(this).addClass("img-responsive");
        });

    });


});