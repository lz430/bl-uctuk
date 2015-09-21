define(['modules/jquery-mozu', 'underscore', 'hyprlive', 'modules/api', "modules/backbone-mozu", 'modules/models-product', 'shim!vendor/flipclock/flipclock[jquery=jQuery]'], function($, _, Hypr, api, Backbone, ProductModels) {
    var getSOTD = function(data) {
        var pcodes = {};
        var retval = {};
        
        for (var i=0,l=data.length;i<l;i++) {
            var key = data[i].productCode;
            pcodes[key] = data[i];
        }
        var apifilter = 'ProductCode in[' + Object.keys(pcodes).join(', ') + ']'; 
        retval = api.get('products', {
            filter: apifilter
        });
        return retval;
    };
    var getFallbackSOTD = function() {
        var fallbackDealSetting = Hypr.getThemeSetting('fallbackDeal');
        var fallbackDeals = fallbackDealSetting.split(/\s*,\s*/); 
        var fallbackDeal = fallbackDeals.length ? fallbackDeals[Math.floor((Math.random() * fallbackDeals.length))] : '';
        return [{"productCode":fallbackDeal}];
    };
     
    $(document).ready(function() {
        var sotdDisplay = $('[data-bl-role="sotd-display"]');
        var template = "modules/speaker-of-the-day/product-panel";
        var SOTDView = Backbone.MozuView.extend({
            templateName : template,
            init : window.sotdInit,
            addToCart: function() {
                  this.model.addToCart();
            },            
            render : function() {
                Backbone.MozuView.prototype.render.apply(this, arguments);
                this.model.on('addedtocart', function(cartitem) {
                    window.location.href = "/cart";
                });            
                var cd = this.model.getCountdown();
                if (cd) {
                    this.clock = $('.mz-home-speaker__time-box__clockface').FlipClock(cd, {
                        clockFace: 'HourlyCounter',
                        autoStart: true,
                        countdown: true,
                        callbacks: {
                            stop: function() {
                                window.location.reload();
                            }
                        }
                    });
                    $('.flip-clock-wrapper .flip-clock-divider').each(function( index, item ) {
                        var fc_group = $(item).add(item.next()).add(item.next().next());
                        fc_group.wrap('<div class="flip-clock-group"></div>');
                    });
                }
            }
        });
        window.sotdInit = function(data) { //productCode, timeRemaining
            if (!data || !data.length) {
                data = getFallbackSOTD();
            }
            var sotdModel = null;
            var sotdSchedule = data;
            var productSOTDView = null;
            getSOTD(data).then(function(collection) {
                var productCollection = new ProductModels.ProductCollection(collection.data);
                for (var d=0,dl=sotdSchedule.length;d<dl;d++) {
                    if (sotdSchedule[d].timeLeft > 0) {
                        for (var i=0,l=productCollection.attributes.items.length;i<l;i++) {
                            var m = productCollection.attributes.items.models[i];
                            if (sotdSchedule[d].productCode === m.id) {
                                if (m.attributes.inventoryInfo && m.attributes.inventoryInfo.onlineStockAvailable > 0) {
                                    m.setStartInventory(sotdSchedule[d].quantity_start);
                                    m.setMediumInventory(sotdSchedule[d].quantity_medium);
                                    m.setLowInventory(sotdSchedule[d].quantity_low);
                                    m.setCountdown(sotdSchedule[d].timeLeft);
                                    sotdModel = m;
                                    break;
                                }
                            }
                        }
                    }
                    if (sotdModel) {
                        break;
                    }
                }
                if (sotdModel) {
                    sotdModel.hasDeal(true);
                    productSOTDView = new SOTDView({
                        model : sotdModel || {},
                        el : sotdDisplay
                    });
                    productSOTDView.render();
                } else {
                    data = getFallbackSOTD();
                    getSOTD(data).then(function(collection) {
                        productCollection = new ProductModels.ProductCollection(collection.data);
                        sotdModel = productCollection.attributes.items.models[0];
                        sotdModel.hasDeal(false);
                        productSOTDView = new SOTDView({
                            model : sotdModel || {},
                            el : sotdDisplay
                        });
                        productSOTDView.render();
                    });
                }
            });
        };
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = Hypr.getThemeSetting('schedulerURL');
        $("body").append(s);
    });
});
