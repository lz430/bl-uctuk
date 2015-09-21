define([
    'modules/jquery-mozu'
  , 'modules/is-mobile'
  , 'modules/backbone-mozu'
  , 'modules/models-cart'
  , 'modules/models-product'
  , 'vendor/jquery-unveil'
  ]
, function($, isMobile, Backbone, CartModels, ProductModels, storage){

    var SoftCartView = Backbone.MozuView.extend({
      templateName: "modules/soft-cart"
    });

    if (isMobile) {
        SoftCartView.prototype.render = function() {
            var count = this.model.count();
            $('.mob-menu-item__cart').find('.mz-soft-cart__item-count').text(count);
            if (count > 0) {
                $('.mob-menu-item__cart').find('.mz-soft-cart__item-count__wrapper').removeClass('is-empty');
            } else {
                $('.mob-menu-item__cart').find('.mz-soft-cart__item-count__wrapper').addClass('is-empty');
            }
        };
    }



    var SoftCartInstance = {
        update: function () {
          return this.view.model.apiGet();
      }

    , updateWith: function(data) {
        this.view.model.set(data);
        this.view.model.syncApiModel();
        this.view.render();
      }

    , show: isMobile ? function () {

        $('.mob-menu-item__cart').find('.mz-soft-cart__item-count').addClass('animated tada');
        $('.mob-menu-item__cart').find('.mz-soft-cart__item-count').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.mob-menu-item__cart').find('.mz-soft-cart__item-count').removeClass('animated tada');
        });

        } : function() {

        this.view.$el.addClass('is-active');

        var self = this;
        var clickAway = function(e) {
            if (!$.contains(self.view.el, e.currentTarget)) {
              self.view.$el.removeClass('is-active');
              $(document.body).off('click', clickAway);
            }
          };

        $(document.body).on('click', clickAway);

            var count = this.view.model.count();
            this.view.$el.find('.mz-soft-cart__item-count').text(count);
            if (count > 0) {
                this.view.$el.find('.mz-soft-cart__item-count__wrapper').removeClass('is-empty');
            } else {
                this.view.$el.find('.mz-soft-cart__item-count__wrapper').addClass('is-empty');
            }
        


      }
    };


    $(document).ready(function() {

      var cart      = new CartModels.Cart()
        , target    = isMobile ? $('[data-mz-cart-count]') : $('[data-mz-action="show-soft-cart"]')
        , cartView  = new SoftCartView({ el: target, model: cart });

      SoftCartInstance.view = cartView;
      SoftCartInstance.update();

        setTimeout(function() {
            var count = cart.count();
            cartView.$el.find('.mz-soft-cart__item-count').text(count);
            if (count > 0) {
                cartView.$el.find('.mz-soft-cart__item-count__wrapper').removeClass('is-empty');
            } else {
                cartView.$el.find('.mz-soft-cart__item-count__wrapper').addClass('is-empty');
            }
        }, 1000);


    });


    return SoftCartInstance;

});
