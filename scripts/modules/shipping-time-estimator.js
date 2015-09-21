require(['modules/jquery-mozu', 'underscore', 'vendor/moment.min', 'modules/modal', 'hyprlive', 'modules/api'], 
function($, _, __notmoment, ModalWindow, Hypr, api) {

    // this whole file is an example of jquery spaghetti code that would be
    // dramatically improved by the use of backbone models and views
    // i shouldn't have done it this way but it serves as a lesson i suppose

    // moment is a bad citizen and names itself when defined
    // which messes up require's runtime module caching
    // this inner require seems to fix it--the first time it's required it returns undefined
    require(['moment'], function(moment) {

  var modalTpt = Hypr.getTemplate('modules/shipping-time-estimator-modal'),
      innerTpt = Hypr.getTemplate('modules/shipping-time-estimator'),
      noShipDates = Hypr.getThemeSetting('noShipDates').split(','),
      noFedexDeliverDates = Hypr.getThemeSetting('noFedexDeliverDates').split(',');

  var ShippingTimeEstimatorModal = function() {
    this.render(this.fillIn(modalTpt));
    this.bindClose();
  };

  $.extend(ShippingTimeEstimatorModal.prototype = new ModalWindow(), {
    constructor: ShippingTimeEstimatorModal,
    render: function(html) {
      var $modal = $(html),
        $modalContents = $modal.find('[data-mz-role="modal-contents"]'),
        self = this;

      this.loadWrapper($modal.appendTo('body'));

      function runEstimate() {
        $modal.addClass('is-loading');
        var zip = $modal.find('[data-mz-value="postalOrZipCode"]').val();
        getDaysInTransit(zip).then(function(days){
          $modal.removeClass('is-loading');
          $.cookie('mozu_shippingestimatezip', zip, { expires: 365, path: '/'});
          $.cookie('mozu_shippingestimatedays', days, { expires: 365, path: '/'});
          updateAllEstimateText(zip, formatArrivalDate(calculateArrivalDate(days)), getOrderByTime());
          $modalContents.html(self.fillIn(innerTpt));
        }, function() {
          $modal.removeClass('is-loading');
          $modal.find('[data-mz-role="errorContainer"]').text('Sorry, an error occurred. Please enter a valid zip code or try again later.');
        });
      }

      $modal.on('click', '[data-mz-action="runEstimate"]', runEstimate);
      $modal.on('keypress', '[data-mz-value="postalOrZipCode"], [data-mz-action="runEstimate"]', function(e) {
        if (e.which === 13) runEstimate();
      });

      this.open();
    },
    fillIn: function(tpt) {
      this.savedZip = $.cookie('mozu_shippingestimatezip');
      this.savedDays = $.cookie('mozu_shippingestimatedays');
      return tpt.render({
        model: {
          zip: this.savedZip,
          estimatedDate: (this.savedDays || this.savedDays === 0) && formatArrivalDate(calculateArrivalDate(this.savedDays)),
          orderByTime: getOrderByTime()
        }
      });
    }
  });

  $(document).ready(function() {
    $('body').on('click', '[data-mz-action="openShippingEstimateModal"]', function() {
      new ShippingTimeEstimatorModal();
    });

    $('body').on('click', '[data-mz-action="changeShippingEstimate"]', function () {
        $(".seismic-shipping-estimator__form").show();
    });

    $('body').on('click', '[data-mz-action="runEstimateProductPage"]', estimateShippingFromProductPage);


    var savedZip = $.cookie('mozu_shippingestimatezip'),
      savedDays = $.cookie('mozu_shippingestimatedays');
    if (savedZip) {
      updateAllEstimateText(savedZip, formatArrivalDate(calculateArrivalDate(savedDays)), getOrderByTime());
      
      $('[data-mz-role="user-location-wrap"]').show();
      $('[data-mz-role="user-location-wrap-unknown"]').hide();

    }
  });

  function estimateShippingFromProductPage() {
      var zip = $('[data-mz-value="postalOrZipCodeProductPage"]').val();
      $('[data-mz-action="runEstimateProductPage"]').addClass("disabled");
      $(".shippingEstimateLoading").removeClass('hide');
      $('.error-shipping-estimate-product-page').text('');
      getDaysInTransit(zip).then(function (days) {
          $(".shippingEstimateLoading").addClass('hide');
          $('[data-mz-action="runEstimateProductPage"]').removeClass("disabled");
            $.cookie('mozu_shippingestimatezip', zip, { expires: 365, path: '/'});
            $.cookie('mozu_shippingestimatedays', days, { expires: 365, path: '/'});
            updateAllEstimateText(zip, formatArrivalDate(calculateArrivalDate(days)), getOrderByTime());
        }, function() {
            $(".shippingEstimateLoading").addClass('hide');
            $('[data-mz-action="runEstimateProductPage"]').removeClass("disabled");
            $('.error-shipping-estimate-product-page').text('Sorry, an error occurred. Please enter a valid zip code or try again later.');
        });
   }

  function updateAllEstimateText(savedZip, savedDays, savedOrderByTime) {
    $('[data-mz-role="user-location"]').text(savedZip);
    $('[data-mz-role="user-location-wrap"]').show();
    $('[data-mz-role="user-location-wrap-unknown"]').show();
    $('[data-mz-role="shipping-estimated-date"]').text(savedDays);
    $('[data-mz-role="shipping-estimated-date-wrap"]').show();
    $('[data-mz-role="order-by-time"]').text(savedOrderByTime);
    $('[data-mz-role="order-by-time-wrap"]').show();
    $('[data-mz-role="shipping-estimate-empty-wrap"]').hide();
    $(".seismic-shipping-estimator__form").hide();
  }

  function getDaysInTransit(zipCode) {
    var payload = $.extend(true, stockRequest, {
      EstimatedShipmentDate: getEstimatedShipmentDate().toISOString(),
      DestinationAddress: {
        PostalOrZipCode: zipCode
      }
    });
    return runShippingApiRequest(payload).then(function(res) {
      return _.findWhere(_.findWhere(res.rates, { carrierId: 'fedex'}).shippingRates, { code: "fedex_FEDEX_GROUND" }).daysInTransit;
    });
  }

  function formatArrivalDate(theDate) {
    return theDate.format('dddd, MMM Do, YYYY');
  }

  function runShippingApiRequest(payload) {
    return api.request('POST',{
      url: '/api/commerce/catalog/storefront/shipping/request-rates',
      iframeTransportUrl: 'https://' + document.location.host + '/receiver?receiverVersion=2'
    }, payload);
  }

  function getCutoff() {
    var hour = isDaylightSavings() ? 19 : 20;
    return moment().hour(0).utc().hour(hour).minute(30);
  }

  function getEstimatedShipmentDate() {
    var now = moment().utc();
    if (now.isAfter(getCutoff())) {
      now.add('days',1);
    }
    return soonestWeShipFrom(now.add('minutes',5));
  }

  var formatStr = "YYYY-MM-DD";

  function dateSatisfies(d, test) {
    d.local();
    while (!test(d)) {
      d.add('days', 1);
    }
    return d;
  }

  function soonestWeShipFrom(d) {
    return dateSatisfies(d, function(date) {
      var day = date.day();
      return day !== 6 && day !== 0 && _.indexOf(noShipDates, date.format(formatStr)) === -1;
    });
  }

  function soonestFedexDelivers(d) {
    return dateSatisfies(d, function(date) {
      return date.day() > 1 && _.indexOf(noFedexDeliverDates, date.format(formatStr)) === -1;
    });
  }

  function calculateArrivalDate(daysInTransit) {
    return soonestFedexDelivers(getEstimatedShipmentDate().add('days',daysInTransit));
  }

  function isDaylightSavings() {
    return moment().zone() !== moment().month(0).zone();
  }

  function getOrderByTime() {
    var cutoff = getCutoff(),
      now = moment.utc(),
      on = now.isAfter(cutoff) ? " tomorrow" : " today";
    return cutoff.local().format('h:mma') + on;
  }

  var stockRequest = {
  "ISOCurrencyCode": "USD", 
  "CarrierIds": ["fedex"],
  "ShippingServiceTypes": ["fedex_FEDEX_GROUND"],
  "EstimatedShipmentDate": "<<TO BE REPLACED>>",
  "OriginAddress": { 
    "Address1": Hypr.getThemeSetting('shippingEstimatorOriginAddress1'), 
    "CityOrTown": Hypr.getThemeSetting('shippingEstimatorOriginCity'), 
    "StateOrProvince": Hypr.getThemeSetting('shippingEstimatorOriginState'), 
    "PostalOrZipCode": Hypr.getThemeSetting('shippingEstimatorOriginZip'), 
    "CountryCode": Hypr.getThemeSetting('shippingEstimatorOriginCountryCode')
  },
  "DestinationAddress": { 
    "PostalOrZipCode": "<<TO BE REPLACED >>", 
    "CountryCode": "US"
  },
  "IsDestinationAddressCommercial": false, 
  "Items": [{ 
    "ShipsByItself": true,
    "UnitMeasurements": { 
      "Weight": { 
        "Unit": "lbs",
        "Value": 10.0
      }
    },
    "Quantity": 1
  }]
};

});
});

