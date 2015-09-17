require(["modules/jquery-mozu", "hyprlive", "modules/backbone-mozu", "modules/models-product"], function($, Hypr, Backbone, ProductModels) {

    var thumbSize, productListObj;

    function init() {
        //We have to wait until the Mozu script finishes running and adds the facetingViews variable to the document
        if ( typeof window.facetingViews == 'undefined') {
            setTimeout(init, 200);
            return;
        }
        window.facetingViews.productList.model.on('loadingchange', function() {
            addEventListeners();
        });

        var productListData = require.mozuData('facetedproducts');

        productListObj = {};
        if (productListData.items && productListData.items.length > 0) {
            jQuery.each(productListData.items, function(i, e) {
                var pCode = e.productCode;
                productListObj[pCode] = e;
            });
        }

        thumbSize = Hypr.getThemeSetting('listProductThumbSize');
        addEventListeners();
    }

    function swapImage() {
        var $this = $(this);

        var newURL = $this.data('bl-altimgurl');
        var curURL = $this.attr('src');

        $this.attr('src', newURL);
        $this.data('bl-altimgurl', curURL);

    }

    function addEventListeners() {
        $('div[data-mz-product]').each(function() {
            var $this = $(this);
            var pCode = $this.data('mz-product');
            var imgAnchor = $this.find('.mz-productlisting-image a');
            var imgDiv = $this.find('.mz-productlisting-image');
            var img = imgAnchor.find('img');

            var product = productListObj[pCode];

            if (product === null || product === undefined) {
                return;
            }

            var productimage = product.content.productImages;
            if (productimage.length <= 1) {
                return;
            }

            img.data('bl-altimgurl', productimage[1].imageUrl + '?max=' + thumbSize);

            img.on('mouseover', swapImage);
            img.on('mouseout', swapImage);
        });
    }


    $(document).ready(function() {
        var $enabled = Hypr.getThemeSetting('enableCategoryPhotoSwap');
        if (console) {
            console.log('image-swap $enabled:');
            console.log($enabled);
        }
        if ($enabled) {
            init();
        }

    });
});
