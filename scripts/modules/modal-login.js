define(['jquery', 'modules/api', 'modules/modal', 'hyprlive'], function($, api, ModalWindow, Hypr) {

    var html = Hypr.getTemplate('modules/modal-login').render({ 
      host: window.location.host,
      returnUrl: window.location.pathname + window.location.search + window.location.hash
    }), // needs hostname since we don't currently have a siteContext url for this
      LoginModal = function() {
        ModalWindow.call(this, html);
        this.$wrapper.appendTo('body');
        $(".mz-modal--login").removeClass("hidden");

        this.loginForm = this.$wrapper.find('[data-mz-role="login-form"]');
        this.forgotForm = this.$wrapper.find('[data-mz-role="forgotpassword-form"]');
        this.$wrapper.on('click', '[data-mz-action="forgotpasswordform"], [data-mz-action="loginform"]', $.proxy(this.toggleLogin, this));
        this.$wrapper.on('click', '[data-mz-action="submitforgotpassword"]', $.proxy(this.submitForgotPassword, this));
        this.open();
      };

      LoginModal.create = function(wishListProductId) {
        LoginModal.current = new LoginModal();
        return LoginModal.current;
      };

    $.extend(LoginModal.prototype = new ModalWindow(), {
        constructor: LoginModal,
        toggleLogin: function() {
          this.loginForm.toggleClass("hidden");
          this.forgotForm.toggleClass("hidden");
          return false;
        },
        displayForgotPasswordMessage: function(msg) {
          this.$wrapper.find('[data-mz-role="forgotpasswordmessage"]').text(msg);
        },
        submitForgotPassword: function(e) {
          e.preventDefault();
          var self = this,
            email = this.$wrapper.find('[data-mz-role="forgotpasswordemail"]').val();
          if (email) {
            api.action('customer', 'resetPasswordStorefront', {
              EmailAddress: email
            }).then(function() {
              self.displayForgotPasswordMessage(Hypr.getLabel('resetEmailSent'));
            }, function(xhr) {
              var msg = xhr.message ||
                (xhr && xhr.responseJSON && xhr.responseJSON.message) ||
                Hypr.getLabel('unexpectedError');
              if (msg.indexOf('Item not found') !== -1) msg = "Sorry, there was no account found for that email address.";
              self.displayForgotPasswordMessage(msg);
            });
          }
        }
    });


  $(document).ready(function() {
      $('[data-mz-role="login-open"]').on('click', LoginModal.create);


    $('[data-mz-action="launchforgotpassword"]').on('click', function(){
      LoginModal.create().toggleLogin();
      return false;
    });
  });

  return LoginModal;

});
