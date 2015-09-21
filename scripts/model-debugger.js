define(['jquery'], function($) {
  $(function() {
    var models = [
      'apicontext',
      'pagecontext',
      'user',
      'facetedproducts',
      'product',
      'pageModel',
      'cart',
      'customer',
      'checkout'
    ], model, currentModel;

    if (console.group) {
        console.group('Model Debugger');

      for (model = 0; model < models.length; model++) {
        currentModel = models[model];

        if (require.mozuData(currentModel)) {
            console.groupCollapsed(currentModel + ':');
              console.info(require.mozuData(currentModel));
            console.groupEnd();
        }
      }

      console.groupEnd();

      window.getProduct = function(productId) {
        require('modules/api').get('product', productId).then(function(product) {
          console.log(product.data);
        });
      };
    }

  });
});
