//Borrowed what I could from the login-links.js provided by Mozu. Thank you, Mozu.
define(['modules/jquery-mozu', 'modules/api', 'hyprlive'], function($, api, Hypr) {
	var LoginPrompt = function() {
	};

	$.extend(LoginPrompt.prototype, {
		setLoading : function(yes) {
			this.loading = yes;
			this.$el[yes ? 'addClass' : 'removeClass']('is-loading');
		},
		displayMessage : function(msg) {
			this.setLoading(false);
			this.$el.find('[data-bl-role="login-prompt-message"]').html('<span class="mz-validationmessage">' + msg + '</span>');
		},
		handleEnterKey : function(e) {
			if (e.which === 13) {
				var $parentForm = $(e.currentTarget).parents('[data-bl-role]');
				switch ($parentForm.data('bl-role')) {
					case "login-form":
						this.login();
						break;
					case "forgot-form":
						this.retrievePassword();
						break;
				}
				return false;
			}
		},
		login : function() {
			this.setLoading(true);
			api.action('customer', 'loginStorefront', {
				email : this.$el.find('[data-mz-login-email]').val(),
				password : this.$el.find('[data-mz-login-password]').val()
			}).then(this.handleLoginComplete, $.proxy(this.displayApiMessage, this));
		},
		retrievePassword : function() {
		    var me = this;
			this.setLoading(true);
			api.action('customer', 'resetPasswordStorefront', {
				EmailAddress : this.$el.find('[data-mz-forgotpassword-email]').val()
			}).then(me.displayResetPasswordMessage());
		},
		handleLoginComplete : function() {
			if (Hypr.engine.options.locals.pageContext.pageType === "cart") {
				var $form = $('#cartform');
				$form.addClass('is-loading');
				$form.submit();
			} else {
                var returnURL = $('[name="returnUrl"]');
                if (returnURL.length > 0) {
                    window.location.replace(returnURL.val());
                } else {
                    window.location.reload();
                }
			}
		},
		displayResetPasswordMessage : function() {
			this.displayMessage(Hypr.getLabel('resetEmailSent'));
			this.showLogin();
		},
		displayApiMessage : function(xhr) {
			this.displayMessage(xhr.message || (xhr && xhr.responseJSON && xhr.responseJSON.message) || Hypr.getLabel('unexpectedError'));
		},
		showLogin : function() {
			this.$login.show();
			this.$forgot.hide();
		},
		showForgot : function() {
			this.$forgot.show();
			this.$login.hide();
		},
		init : function(el) {
			this.$el = $(el);
			this.$login = $(this.$el.find('[data-bl-role="login-form"]'));
			this.$forgot = $(this.$el.find('[data-bl-role="forgot-form"]'));
			this.loading = false;

			//Listeners
			this.$login.on('click', '[data-bl-action="show-forgot"]', $.proxy(this.showForgot, this));
			this.$login.on('click', '[data-bl-action="submit-login"]', $.proxy(this.login, this));
			this.$forgot.on('click', '[data-bl-action="show-login"]', $.proxy(this.showLogin, this));
			this.$forgot.on('click', '[data-bl-action="submit-forgot"]', $.proxy(this.retrievePassword, this));
			this.$el.on('keyup', 'input', $.proxy(this.handleEnterKey, this));
		}
	});

	$(document).ready(function() {
		$('[data-bl-role="login-prompt"]').each(function() {
			var prompt = new LoginPrompt();
			prompt.init(this);
		});
	});
});
