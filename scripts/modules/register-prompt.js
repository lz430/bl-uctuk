//Borrowed what I could from the login-links.js provided by Mozu. Thank you, Mozu.
define(['modules/jquery-mozu', 'modules/api', 'hyprlive'], function($, api, Hypr) {
	var RegisterPrompt = function() {
	};

	$.extend(RegisterPrompt.prototype, {
		setLoading : function(yes) {
			this.loading = yes;
			this.$el[yes ? 'addClass' : 'removeClass']('is-loading');
		},
		displayMessage : function(msg) {
			this.setLoading(false);
			this.$el.find('[data-bl-role="register-prompt-message"]').html('<span class="mz-validationmessage">' + msg + '</span>');
		},
		handleEnterKey : function(e) {
			if (e.which === 13) {
				var $parentForm = $(e.currentTarget).parents('[data-bl-role]');
				if ($parentForm.data('bl-role') == "register-form") {
						this.signup();
				}
				return false;
			}
		},
        signup: function () {
            var self = this,
                email = this.$register.find('[data-mz-signup-emailaddress]').val(),
                firstName = this.$register.find('[data-mz-signup-firstname]').val(),
                lastName = this.$register.find('[data-mz-signup-lastname]').val(),
                payload = {
                    account: {
                        emailAddress: email,
                        userName: email,
                        firstName: firstName,
                        lastName: lastName,
                        contacts: [{
                            email: email,
                            firstName: firstName,
                            lastNameOrSurname: lastName
                        }]
                    },
                    password: this.$register.find('[data-mz-signup-password]').val()
                };
            if (this.validate(payload)) {
                this.setLoading(true);
                return api.action('customer', 'createStorefront', payload).then(function () {
					var returnURL = $('[name="returnUrl"]');
					if (returnURL.length > 0) {
						window.location.replace(returnURL.val());
					} else {
						window.location.reload();
					}
                }, self.displayApiMessage);
            }
        },
		displayApiMessage : function(xhr) {
			this.displayMessage(xhr.message || (xhr && xhr.responseJSON && xhr.responseJSON.message) || Hypr.getLabel('unexpectedError'));
		},
        validate: function (payload) {
            if (!payload.account.emailAddress) return this.displayMessage(Hypr.getLabel('emailMissing')), false;
            if (!payload.password) return this.displayMessage(Hypr.getLabel('passwordMissing')), false;
            if (payload.password !== this.$register.find('[data-mz-signup-confirmpassword]').val()) return this.displayMessage(Hypr.getLabel('passwordsDoNotMatch')), false;
            return true;
        },
		init : function(el) {
			this.$el = $(el);
			this.$register = $(this.$el.find('[data-bl-role="register-form"]'));
			this.loading = false;

			//Listeners
			this.$register.on('click', '[data-bl-action="register"]', $.proxy(this.signup, this));
		}
	});

	$(document).ready(function() {
		$('[data-bl-role="register-prompt"]').each(function() {
			var prompt = new RegisterPrompt();
			prompt.init(this);
		});
	});
});
