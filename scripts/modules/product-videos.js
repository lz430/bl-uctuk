///**
// * Adds video thumb 
// */
require(["modules/jquery-mozu", "hyprlive", "modules/backbone-mozu", "modules/models-product", "modules/views-productimages"], function($, Hypr, Backbone, ProductModels, ProductImageViews) {
	
	
	$(document).ready(function(){
		var currentProduct = ProductModels.Product.fromCurrent();
		var playerUrl = null;
		$.each(currentProduct.attributes.properties, function(i,e){
			if(e.attributeFQN ==	"tenant~360-view-url"){
				playerUrl = e.values[0].stringValue + '/PZR_HD.html';
			}			
		});
		
		var frame = $('<iframe />').addClass('bl-360-view-container');
		$('.mz-productimages').prepend(frame);
		
		$('.mz-productimages-thumb').on('click', function(){
			if(!$(this).hasClass('bl-360-view-thumb')){
				$('.mz-productimages').removeClass('bl-360-view-visible');
			}
			
			
		});

		
		
		
		
		
		$('.bl-360-view-thumb').on('click', function(){
			//Render video and swap out with photo
			if(playerUrl !== null){
				frame.attr('src', playerUrl);
				$('.mz-productimages').addClass('bl-360-view-visible');
			}			
		});		
	});
});
