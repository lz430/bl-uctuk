﻿define(['jquery', 'underscore', 'modules/backbone-mozu', 'hyprlive'], function ($, _, Backbone, Hypr) {
    // payment methods only validate if they are selected!
    var PaymentMethod = Backbone.MozuModel.extend({
        present: function (value, attr) {
            if (!this.selected) return undefined;
            if (!value) return this.validation[attr.split('.').pop()].msg || Hypr.getLabel('genericRequired');
        }
    });

    var twoWayCardShapeMapping = {
        "cardNumber": "cardNumberPartOrMask",
        "cardNumberPart": "cardNumberPartOrMask",
        "cardType": "paymentOrCardType",
        "id": "paymentServiceCardId"
    };

    var firstDigitMap = {
        "3": "AMEX",
        "4": "VISA",
        "5": "MC",
        "6": "DISCOVER"
    };

    var CreditCard = PaymentMethod.extend({
        mozuType: 'creditcard',
        isCvvOptional: false,
        validation: {
            paymentOrCardType: {
                fn: "present",
                msg: Hypr.getLabel('cardTypeMissing')
            },
            cardNumberPartOrMask: {
                fn: "present",
                msg: Hypr.getLabel('cardNumberMissing')
            },
            expireMonth: {
                fn: 'expirationDateInPast'
            },
            expireYear: {
                fn: 'expirationDateInPast'
            },
            nameOnCard: {
                fn: "present",
                msg: Hypr.getLabel('cardNameMissing')
            },
            cvv: {
                fn: function(value, attr) {
                    var cardType = attr.split('.')[0],
                        card = this.get(cardType);

                    if (card.get('isCvvOptional')) return '';

                    if (!this.selected) return undefined;
                    if (!value)
                        return Hypr.getLabel('securityCodeMissing') || Hypr.getLabel('genericRequired');
                }
            }
        },
        initialize: function () {
            var self = this;
            _.each(twoWayCardShapeMapping, function (k, v) {
                self.on('change:' + k, function (m, val) {
                    self.set(v, val, { silent: true });
                });
                self.on('change:' + v, function (m, val) {
                    self.set(v, val, { silent: true });
                });
            });

            if (this.detectCardType) {
                this.on('change:cardNumberPartOrMask', _.debounce(function(self, newValue) {
                    var firstDigit;
                    if (newValue && newValue.toString) {
                        firstDigit = newValue.toString().charAt(0);
                    }
                    if (firstDigit && firstDigit in firstDigitMap) {
                        self.set({ paymentOrCardType: firstDigitMap[firstDigit] });
                    }
                }, 500));
            }
        },
        dataTypes: {
            expireMonth: Backbone.MozuModel.DataTypes.Int,
            expireYear: Backbone.MozuModel.DataTypes.Int,
            isCardInfoSaved: Backbone.MozuModel.DataTypes.Boolean
        },
        expirationDateInPast: function (value, attr, computedState) {
            if (!this.selected) return undefined;
            var expMonth = this.get('expireMonth'),
                expYear = this.get('expireYear'),
                exp,
                thisMonth,
                isValid;

            if (isNaN(expMonth) || isNaN(expYear)) return false;

            exp = new Date(expYear, expMonth - 1, 1, 0, 0, 0, 0);
            thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);

            isValid = exp >= thisMonth;
            if (!isValid) return Hypr.getLabel('cardExpInvalid');
        },
        // the toJSON method should omit the CVV so it is not sent to the wrong API
        toJSON: function (options) {
            var j = PaymentMethod.prototype.toJSON.apply(this);
            if (j.card && (!options || !options.helpers)) delete j.card.cvv;
            _.each(twoWayCardShapeMapping, function (k, v) {
                if (!(k in j) && (v in j)) j[k] = j[v];
                if (!(v in j) && (k in j)) j[v] = j[k];
            });
            return j;
        }
    });


    var PayPal = PaymentMethod.extend({
        mozuType: 'paypalpayment'
    });

    var Check = PaymentMethod.extend({
        validation: {
            nameOnCheck: {
                fn: "present"
            },
            routingNumber: {
                fn: "present"
            },
            checkNumber: {
                fn: "present"
            }
        }
    });

    var DigitalCredit = PaymentMethod.extend({

        isEnabled: false,
        creditAmountApplied: null,
        remainingBalance: null,
        isTiedToCustomer: true,
        addRemainderToCustomer: false,

        initialize: function() {
            this.set({ isEnabled: this.isEnabled });
            this.set({ creditAmountApplied: this.creditAmountApplied });
            this.set({ remainingBalance: this.remainingBalance });
            this.set({ isTiedToCustomer: this.isTiedToCustomer });
            this.set({ addRemainderToCustomer: this.addRemainderToCustomer });
        },

        helpers: ['calculateRemainingBalance'],

        calculateRemainingBalance: function () {
            return (! this.get('creditAmountApplied')) ? this.get('currentBalance') : this.get('currentBalance') - this.get('creditAmountApplied');
        },

        validate: function(attrs, options) {
            if ( (attrs.creditAmountApplied) && (attrs.creditAmountApplied > attrs.currentBalance)) {
                return "Exceeds card balance.";
            }
        }
    });

    return {
        CreditCard: CreditCard,
        Check: Check,
        DigitalCredit: DigitalCredit
    };
});