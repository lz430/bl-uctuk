define([
    'modules/jquery-mozu'
  , 'modules/is-mobile'
  , 'modules/backbone-mozu'
  , 'modules/api'
  , 'modules/models-customer'
  ]
, function ($, isMobile, Backbone, api, CustomerModels) {


    function GetWishList(accountId) {
        return api.request('GET', {
            url: '/api/commerce/wishlists/customers/' + accountId + '/my_wishlist'
        });
    }

    $(document).ready(function () {

        var user = require.mozuData('user');
        if (!user.isAnonymous) {

            GetWishList(user.accountId).then(function (json) {

                var count = json.items.length;

                if (count > 0) {
                    $('.mz-wishlist__item-count__wrapper').removeClass('is-empty');
                } else {
                    $('.mz-wishlist__item-count__wrapper').addClass('is-empty');
                }

                $('.mz-wishlist__item-count').text(count);


            });


        }


    });
});
