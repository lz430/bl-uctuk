/* jshint laxbreak:true */
define([
    'jquery'
  , 'hyprlivecontext'
  ]

, function($, HyprLiveContext) {
  $(function() {

    var themeSettings = HyprLiveContext.locals.themeSettings

      , shopByDeptLink = $('.mz-nav-trigger')[0]
      , subCategoryPanels = $('.mz-nav-trigger').find('[data-mz-nav-component="category-listings"]')

      , navPromos = [
          {
            graphic:  themeSettings.mainNavBannerGraphic1
          , link:     themeSettings.mainNavBannerLink1
          }
        , {
            graphic:  themeSettings.mainNavBannerGraphic2
          , link:     themeSettings.mainNavBannerLink2
          }
        , {
            graphic:  themeSettings.mainNavBannerGraphic3
          , link:     themeSettings.mainNavBannerLink3
          }
        , {
            graphic:  themeSettings.mainNavBannerGraphic4
          , link:     themeSettings.mainNavBannerLink4
          }
        , {
            graphic:  themeSettings.mainNavBannerGraphic5
          , link:     themeSettings.mainNavBannerLink5
          }
        , {
            graphic:  themeSettings.mainNavBannerGraphic6
          , link:     themeSettings.mainNavBannerLink6
          }
        ]
      ;


    // Iterate over each subCat Panel
    $.each(subCategoryPanels, function(index, value) {
        var $this                 = $(this)
          , promo                 = navPromos[index]
          ;

        if (promo && promo.graphic !== '') {

          $this.addClass('has-promo-image');

          var openBanner  = '<div class="mz-promo-image">'
            , closeBanner = '</div>'
            , openLink    = ''
            , closeLink   = ''
            , graphicImg  = '<img src="' + promo.graphic + '">'
            ;

          if (promo.link !== '') {
            openLink = '<a href="' + promo.link + '">';
            closeLink = "</a>";
          }

          $this.append(
              openBanner
              + openLink
                + graphicImg
              + closeLink
            + closeBanner
            );

        }

        // console.log(navPromos[index]);

      });

  });
});


// http://placehold.it/175x450/bada55/ffffff
// /testing-this-link

// http://placehold.it/175x450/ff9900/ffffff
// /testing-this-link-again

// http://placehold.it/175x450/fe57a1/ffffff
// /third-times-the-charm
