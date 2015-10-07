///**
// * Adds a class to the header element when the page is scrolled past it's top position
// */
define(['jquery'], function($) {
	
	var excludedPageClasses = [
		"mz-cart",
		"mz-checkout",
		"mz-confirmation",
		"mz-myaccount"
	];
	
	
	$(document).ready(function(){
		var isExcluded = false;
		$.each(excludedPageClasses, function(i,e){
			if($('body').hasClass(e)){
				isExcluded= true;
				return;
			}	
		});
		if(isExcluded){
			return;
		}
		
		var winWidth = $(window).width();
		var headerTop = $('header').offset().top;
	
		$(document).on('scroll',function(event){
			var scrollPos = $(window).scrollTop();
		
			if(scrollPos >= headerTop && winWidth >= 979){
				$('header').addClass('sticky');    
			}else{
				$('header').removeClass('sticky');   
			}
		});
	});
});
